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
        const access = await checkVendorAccess(vendorId, ctx.userId)
        if(!access)
        {}//    throw new Error("Unauthorized!");x

        return await CatalogModel.find({vendorId});
    }
    
    @Query(() => [ActiveCatalogOutput])
    async activeCatalogs(
        @Arg("filter") filter: CatalogFilters
    ): Promise<ActiveCatalogOutput[]> {
        console.log(filter);
        let filters : any = {};
        if(filter?.vendorId)
            filters["vendor._id"] = Types.ObjectId(filter.vendorId);
        if(filter?.category)
            filters.catalogCategoryId = Types.ObjectId(filter.category);
        if(filter?.search)
            filters["$or"] = [
                                {title: { "$regex": filter.search, "$options": "i" }},
                                {"outlet.name": { "$regex": filter.search, "$options": "i" }},
                                {"outlet.state": { "$regex": filter.search, "$options": "i" }}
                            ]
        if(filter?.state)
            filters["outlet.state"] = filter.state;
        console.log(filters);

        const today = new Date();
            
        const catalogs = await CatalogModel.aggregate([
            {
                $project: {
                    vendorId: 1,
                    title: 1,
                    outlets: 1,
                    pages: 1,
                    outletCopy : "$outlets",
                    catalogCategoryId: 1,
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
                    "outlet.state": 1,
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
                    _id: "$outlet.state",
                    state: { $first: "$outlet.state"},
                    catalogs: {
                      $push: {
                        id: "$catalogCategoryId",
                        title: "$title",
                        outletName: "$outlet.name",
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
        ]);

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
                    minDistance: 0,
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
                $project: {
                    title: "$catalogs.title",
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
                      "location": "$location",
                      "distance": "$distance",
                    }
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
        @Arg("id") id : String
    ): Promise<Catalog> {
        return await CatalogModel.findById(id);
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
