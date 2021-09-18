import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql"
import CatalogModel, { Catalog } from "../models/Catalog";
import { CatalogInput, UpdPagesInput, UploadRespType, CatalogFilters, CatalogOutput, ActiveCatalogOutput } from "../gqlObjectTypes/catalog.type";
import { v4 as uuidv4 } from 'uuid';
import { Types } from "mongoose";
import { Context } from "vm";
import { checkVendorAccess } from "./auth";
import { CatalogStatus } from "../enums/catalogstatus.enum";
import VendorOutletModel from "../models/VendorOutlet";
import VendorUserModel from "../models/VendorUser";

const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');

@Resolver()
export class CatalogResolver {
    
    @Query(() => [Catalog])
    async catalogs(
        @Arg("vendorId") vendorId : string,
        @Ctx() ctx: Context
    ): Promise<Catalog[]> {
        if(ctx.userType == "VENDOR"){
            const vendorUser = await VendorUserModel.findById(ctx.userId);
            const catalogs = await CatalogModel.aggregate([
                {
                    $match: {
                        outlets: {
                            $in: vendorUser?.outlets.map((el: Types.ObjectId) => Types.ObjectId(el.toString())) || []
                        }
                    }
                }
            ]);
            return catalogs;
        }
        else{
            const access = await checkVendorAccess(vendorId, ctx.userId)
            if(!access)
            {}//    throw new Error("Unauthorized!");x

            return await CatalogModel.find({vendorId});
        }
    }
    
    @Query(() => [Catalog])
    async otherCatalogsOfVendor(
        @Arg("catalogId") catalogId : string,
    ): Promise<Catalog[]> {
        console.log(catalogId);
        const _tmp = await CatalogModel.findById(catalogId);
        console.log(_tmp);
        const vendorId = _tmp.vendorId;
        
        const catalogs = await CatalogModel.aggregate([
            {
                $match: {
                    vendorId: Types.ObjectId(vendorId),
                    _id: {
                      $ne: Types.ObjectId(catalogId)
                    }
                }
            },
            {
                $lookup: {
                    from: 'vendoroutlets',
                    localField: 'outlets',
                    foreignField: '_id',
                    as: 'outlets'
                }
            },
            {
                $lookup: {
                    from: 'vendors',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            {
                $unwind: {
                    path: "$vendor"
                }
            }
        ]);
        return catalogs;
    }
    
    @Query(() => [ActiveCatalogOutput])
    async activeCatalogs(
        @Arg("filter") filter: CatalogFilters,
        @Arg("state") state: string
    ): Promise<ActiveCatalogOutput[]> {
        let filters : any = {};

        if((filter.vendorId?.filter(el => el!='').length || 0) > 0)
            filters["vendor._id"] = { $in : filter.vendorId?.filter(el => el!='').map(el=> Types.ObjectId(el)) || [] };
        if(filter?.category)
            filters.catalogCategoryId = Types.ObjectId(filter.category);
        if(filter?.search)
            filters["$or"] = [
                                {title: { "$regex": filter.search, "$options": "i" }},
                                {"outlet.name": { "$regex": filter.search, "$options": "i" }},
                                {"outlet.namear": { "$regex": filter.search, "$options": "i" }},
                                {"outlet.state": { "$regex": filter.search, "$options": "i" }}
                            ]
        if(filter?.state)
            filters["outlet.state"] = filter.state;

        const today = new Date();
            
        const catalogs = await CatalogModel.aggregate([
            {
                $project: {
                    vendorId: 1,
                    title: 1,
                    titlear: 1,
                    outlets: 1,
                    pages: 1,
                    outletCopy : "$outlets",
                    catalogCategoryId: 1,
                    catalogId: "$_id",
                    expiry: 1,
                    startDate: 1,
                    status: 1           
                }
            },
            {
                $lookup:{
                    from: 'vendoroutlets',
                    localField: 'outlets',
                    foreignField: '_id',
                    as: 'outlets'
                }
            },
            {
                $lookup:{
                    from: 'vendors',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            {
                $unwind: {
                    path: "$vendor",
                }
            },
            {
                $unwind: {
                    path: "$outletCopy",
                }
            },
            {
                $lookup: {
                    from: 'vendoroutlets',
                    localField: 'outletCopy',
                    foreignField: '_id',
                    as: 'outlet'
                }
            },
            {
                $unwind: {
                    path: "$outlet",
                }
            },
            {
                $sort: {
                    "vendor.grade": 1
                }
            },
            {
                $match:{
                    status: "ACCEPTED",
                    expiry: { $gte : today },
                    startDate: { $lte : today },
                    ...filters
                }
            },
            {
                $group: {
                    _id: {
                      state: "$outlet.state",
                      catalogId: "$catalogId"
                    },
                    catalogId: { $first: "$catalogId" },
                    state: { $first: "$outlet.state" },
                    catalogs: {
                      $first: {
                        _id: "$catalogId",
                        id: "$catalogId",
                        catalogCategoryId: "$catalogCategoryId",
                        title: "$title",
                        titlear: "$titlear",
                        outletName: "$outlet.name",
                        outlet: {
                          "name": "$outlet.name",
                          "namear": "$outlet.namear",
                          "state": "$outlet.state",
                          "place": "$outlet.place"
                        },
                        vendor: {
                          id: "$vendor._id",
                          logo: "$vendor.logo",
                          shopname: "$vendor.shopname"
                        },
                        pages: "$pages",
                        outlets: "$outlets",
                        expiry: "$expiry"
                      }
                    }
                }
            },
            {
                $group: {
                    _id: "$state",
                    state: {
                        $first: "$state"
                    },
                    catalogs: {
                      $push: "$catalogs"
                    }
                }
            }
        ]);

        catalogs.sort(function(x,y){ return x.state == state ? -1 : y.state == state ? 1 : 0; });

        return catalogs;
    }
    
    @Query(() => [CatalogOutput])
    async nearCatalogs(
        @Arg("coords") coords: String
    ): Promise<CatalogOutput[]> {
        let _coords = [];
        _coords[0] = parseFloat(coords.split(",")[0] || "") || 0;
        _coords[1] = parseFloat(coords.split(",")[1] || "") || 0;
      //  console.log(_coords);

        const today = new Date();
       // const yesterday = new Date().setDate(new Date().getDate()-1)

        const catalogs = await VendorOutletModel.aggregate([
            {
                $geoNear: {
                    near: {
                      type: "Point",
                      coordinates: _coords
                    },
                    distanceField: "distance",
                    spherical: true
                  }         
            },
            {
                $lookup:{
                    from: 'catalogs',
                    localField: '_id',
                    foreignField: 'outlets',
                    as: 'catalogs'
                }
            },
            {
                $unwind: {
                    path: "$catalogs"
                }
            },
            {
                $lookup:{
                    from: 'vendors',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            {
                $unwind: {
                    path: "$vendor"
                }
            },
            {
                $lookup:{
                    from: 'vendoroutlets',
                    localField: 'outlets',
                    foreignField: '_id',
                    as: 'outlets'
                }
            },
            {
                $project: {
                    title: "$catalogs.title",
                    titlear: "$catalogs.titlear",
                    expiry: "$catalogs.expiry",
                    status: "$catalogs.status",
                    startDate: "$catalogs.startDate",
                    pages: "$catalogs.pages",
                    "vendor._id" : 1,
                    "vendor.shopname": 1,
                    "vendor.logo": 1,
                    "vendor.outlets": 1,
                    outlet: {
                      "name": "$name",
                      "state": "$state",
                      "place": "$place",
                      "location": "$location",
                      "distance": "$distance",
                    },
                    outlets: "$outlets",
                }
            },
            {
                $match:{
                    status: "ACCEPTED",
                    expiry: { $gte : today },
                    startDate: { $lte : today }
                }
            },
            {
                $limit: 7
            }
        ]);

        return catalogs;
    }
    
    @Query(() => Catalog)
    async catalogDt(
        @Arg("id") id : string
    ): Promise<Catalog> {
        const catalogs = await CatalogModel.aggregate([
            {
                $match: {
                    _id: Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'vendoroutlets',
                    localField: 'outlets',
                    foreignField: '_id',
                    as: 'outlets'
                }
            },
            {
                $lookup: {
                    from: 'catalogcategories',
                    localField: 'catalogCategoryId',
                    foreignField: '_id',
                    as: 'catalogCategoryDt'
                }
            },
            {
                $unwind: {
                    path: "$catalogCategoryDt"
                }
            }
        ]);
        return catalogs.length>0 && catalogs[0];
    }
    
    @Query(() => [CatalogOutput])
    async catalogRequests(): Promise<CatalogOutput[]> {
        return await CatalogModel.find({status: CatalogStatus.PENDING},"id title vendorId startDate")
        .populate("vendorId","id shopname");
    }

    @Mutation(() => Boolean)
    async catalogAction(
        @Arg("id") id: string,
        @Arg("action") action: string,
    ): Promise<Boolean> {
        const status = action == "approve" ? CatalogStatus.ACCEPTED : CatalogStatus.REJECTED;
        const result = await CatalogModel.findByIdAndUpdate(id,{
            $set:{
                status
            }
        })
        return result ? true : false;
    }

    @Mutation(() => Boolean)
    async updCatalogEnabled(
        @Arg("catalogId") catalogId: string,
        @Arg("enabled") enabled: Boolean
    ): Promise<Boolean> {
        console.log(enabled);
        await CatalogModel.findByIdAndUpdate(catalogId,{
            $set:{
                enabled
            }
        })
        return true;
    }

    @Mutation(() => Catalog)
    async addCatalog(
        @Arg("input") input: CatalogInput
    ): Promise<Catalog> {
        const user = new CatalogModel({...input});
        const result = await user.save()
        return result;
    }

    @Mutation(() => UploadRespType)
    async updCatalogPages(
        @Arg("pages",() => UpdPagesInput)  pages : UpdPagesInput
    ): Promise<UploadRespType> {

        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });

        let catalog = await CatalogModel.findById(pages.catalogId);
        let _pages = [...catalog.pages];

        if(!catalog)
            return { result : false };

        let i = 0;
        for(const file of pages?.files)
        {
            if(file.newImg)
            {
                const { createReadStream, filename, mimetype } = await file?.newImg;

                const { Location } = await s3.upload({ // (C)
                    Bucket: BUCKET_NAME,
                    Body: createReadStream(),               
                    Key: `${uuidv4()}${path.extname(filename)}`,  
                    ContentType: mimetype                   
                }).promise();       

                if(file.oldImg)
                    try {
                        await s3.deleteObject({
                            Bucket: BUCKET_NAME,
                            Key: file.oldImg.split('/').pop()
                        }).promise()
                        console.log("file deleted Successfully")
                    }
                    catch (err) {
                        console.log("ERROR in file Deleting : " + JSON.stringify(err))
                    }
                
                console.log(Location);
                _pages[i] = Location;
            }
            i++;
        }

        await CatalogModel.findByIdAndUpdate(pages.catalogId,{
            $set: {
                pages: _pages,
                status: CatalogStatus.PENDING
            }
        })

        return { result: true };
    }
}
