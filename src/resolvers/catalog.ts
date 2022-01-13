import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql"
import CatalogModel, { Catalog } from "../models/Catalog";
import { CatalogInput, UpdPagesInput, UploadRespType, CatalogFilters, CatalogOutput, ActiveCatalogOutput, BookmarkInput, UpdPdfInput } from "../gqlObjectTypes/catalog.type";
import { v4 as uuidv4 } from 'uuid';
import { Types } from "mongoose";
import { Context } from "vm";
import { checkVendorAccess } from "./auth";
import { CatalogStatus } from "../enums/catalogstatus.enum";
import VendorOutletModel from "../models/VendorOutlet";
import VendorUserModel from "../models/VendorUser";
import sharp from 'sharp';
import { fromPath } from "pdf2pic";

const fs = require('fs');

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
        @Arg("state") state : string,
    ): Promise<Catalog[]> {
        
        const today = new Date();

        const _tmp = await CatalogModel.findById(catalogId);
        const vendorId = _tmp.vendorId;
        
        const catalogs = await CatalogModel.aggregate([
            {
                $match: {
                    vendorId: Types.ObjectId(vendorId),
                    _id: {
                      $ne: Types.ObjectId(catalogId)
                    },
                    status: "ACCEPTED",
                    expiry: { $gte : today },
                    startDate: { $lte : today }
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
                $match: {
                    'outlets.state': state
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
                $match:{
                    status: "ACCEPTED",
                    startDate: { $lte : today },
                }
            },
            {
                $project: {
                    vendorId: 1,
                    title: 1,
                    titlear: 1,
                    outlets: 1,
                    pages: 1,
                    thumbnails: 1,
                    outletCopy : "$outlets",
                    catalogCategoryId: 1,
                    catalogId: "$_id",
                    expiry: 1,
                    startDate: 1,
                    status: 1,
                    pdf:1,
                    "endDate": {$add: [ {$dateFromString :{ dateString:  {$dateToString:{format: "%Y-%m-%d", date: "$expiry"}}}},1*24*60*60000 ]}       
                }
            },
            {
                $match:{
                    endDate: { $gte : today }
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
                    'vendor.active': true,
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
                        thumbnails: "$thumbnails",
                        outlets: "$outlets",
                        expiry: "$expiry",
                        pdf:"$pdf"
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
    async bookmarkedCatalogs(
        @Arg("bookmarks") bookmarks: BookmarkInput,
    ): Promise<CatalogOutput[]> {

        const _bookmarks = bookmarks?.bookmarks?.map(el => Types.ObjectId(el.toString()));
        
        const today = new Date();

        console.log(_bookmarks);
            
        const catalogs = await CatalogModel.aggregate([
            {
                $match:{
                    status: "ACCEPTED",
                    expiry: { $gte : today },
                    startDate: { $lte : today },
                    _id: { $in : _bookmarks }
                }
            },
            {
                $project: {
                    vendorId: 1,
                    title: 1,
                    titlear: 1,
                    outlets: 1,
                    pages: 1,
                    thumbnails: 1,
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
                $project: {
                    _id: "$catalogId",
                    id: "$catalogId",
                    catalogCategoryId: "$catalogCategoryId",
                    title: "$title",
                    titlear: "$titlear",
                    outletName: {$first : "$outlets.name"},
                    outlet: {
                      "name": {$first : "$outlets.name"},
                      "namear": {$first : "$outlets.namear"},
                      "state": {$first : "$outlets.state"},
                      "place": {$first : "$outlets.place"}
                    },
                    vendor: {
                      id: "$vendor._id",
                      logo: "$vendor.logo",
                      shopname: "$vendor.shopname"
                    },
                    pages: "$pages",
                    thumbnails: "$thumbnails",
                    outlets: "$outlets",
                    expiry: "$expiry"
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
                    localField: 'catalogs.outlets',
                    foreignField: '_id',
                    as: 'outlets'
                }
            },
            {
                $project: {
                    '_id': "$catalogs._id",
                    'id': "$catalogs._id",
                    title: "$catalogs.title",
                    titlear: "$catalogs.titlear",
                    expiry: "$catalogs.expiry",
                    status: "$catalogs.status",
                    startDate: "$catalogs.startDate",
                    pages: "$catalogs.pages",
                    thumbnails: "$catalogs.thumbnails",
                    "vendor._id" : 1,
                    "vendor.shopname": 1,
                    "vendor.logo": 1,
                    "vendor.outlets": 1,
                    "vendor.active": 1,
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
                $group: {

                    _id: "$id",
                    id: { $first: "$id" },
                    title: {
                        $first: "$title"
                    },
                    titlear: {
                        $first: "$titlear"
                    },
                    expiry: {
                        $first: "$expiry"
                    },
                    status: {
                        $first: "$status"
                    },
                    startDate: {
                        $first: "$startDate"
                    },
                    pages: {
                        $first: "$pages"
                    },
                    thumbnails: {
                        $first: "$thumbnails"
                    },
                    vendor: {
                        $first: {
                            "_id": "$vendor._id",
                            "shopname": "$vendor.shopname",
                            "logo": "$vendor.logo",
                            "active": "$vendor.active"
                        }
                    },
                    outlet: {
                        $first: {
                            "name": "$outlet.name",
                            "state": "$outlet.state",
                            "place": "$outlet.place",
                            "location": "$outlet.location",
                            "distance": "$outlet.distance",
                        }
                    },
                    outlets: {
                        $first: "$outlets"
                    }
                }
            },
            {
                $match:{
                    status: "ACCEPTED",
                    'vendor.active': true,
                    expiry: { $gte : today },
                    startDate: { $lte : today }
                }
            },
            {
                $sort: {
                    'outlet.distance': 1
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

    @Mutation(() => Boolean)
    async updCatalogExpDate(
        @Arg("catalogId") catalogId: string,
        @Arg("expiry") expiry: string
    ): Promise<Boolean> {
        await CatalogModel.findByIdAndUpdate(catalogId,{
            $set:{
                expiry
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


    @Mutation(() => Boolean)
    async genThumbnails(
        @Arg("id") id: string
    ): Promise<Boolean> {
        const catalog = await CatalogModel.findById(id);
        if(!catalog) return false;



        var images: any[] = [];

        for(const page of catalog.pages)
        {
            const img = await this.getS3PathFromURL(page);
            images.push(img);
        }


        await CatalogModel.findByIdAndUpdate(id,{
            $set: {
                thumbnails: images
            }
        })
        
        return true;
    }
    
    getS3PathFromURL = async(url:string) => {
        return new Promise((resolve, reject) => {
            
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });
        var request = require('request').defaults({ encoding: null });

        request.get(url, async function (error: any, response: { statusCode: number; headers: { [x: string]: string; }; }, body: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) {
            if (!error && response.statusCode == 200) {
                // const data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                // console.log(data);

                const buffer = await sharp(Buffer.from(body)).resize({ width: 200 }).toBuffer();
                const { Location } = await s3.upload({ // (C)
                    Bucket: BUCKET_NAME,
                    Body: buffer,               
                    Key: `${uuidv4()}${path.extname(url)}`,  
                    ContentType: "image"                   
                }).promise();      
                resolve(Location);
                }
                else
                reject("");
        });
    })
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
    

    @Mutation(() => UploadRespType)
    async updCatalogPdf(
        @Arg("pages",() => UpdPdfInput)  pages : UpdPdfInput
    ): Promise<UploadRespType> {
        
        let catalog = await CatalogModel.findById(pages.catalogId);

        if(!catalog){
            return { result: false };
        }
            
        const { createReadStream, filename } = await pages?.pdf;

        const stream = createReadStream();
        const pathObj : any = await storeFS(stream, filename);

        const options = {
            density: 100,
            saveFilename: "untitled",
            savePath: "/Users/ncod/Documents/Work",
            format: "png",
            width: 600,
            height: 600
          };
        const convert = fromPath(pathObj.path, options);
          
        if (convert.bulk)
            convert.bulk(-1).then((resolve) => {
                console.log(resolve);
              
              });

        return { result: true };
    }

    @Mutation(() => UploadRespType)
    async updCatalogPdf2(
        @Arg("pages",() => UpdPdfInput)  pages : UpdPdfInput
    ): Promise<UploadRespType> {
        

        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });

        let catalog = await CatalogModel.findById(pages.catalogId);
        let _pdf = "";
        let oldPdf = catalog.pdf;

        if(!catalog){
            return { result: false };
        }
            
        const { createReadStream, filename, mimetype } = await pages?.pdf;

        // const stream = createReadStream();
        // const pathObj : any = await storeFS(stream, filename);

        // var PDFImage = require("pdf-image").PDFImage;
 
        // var pdfImage = new PDFImage(pathObj.path);
        // try {
        // const imagePaths = await pdfImage.convertFile();
        //         console.log(imagePaths);
      
        // } catch (err) {
        //     console.log(err);
        // }
 

        // console.log(pathObj);

        const { Location } = await s3.upload({ // (C)
            Bucket: BUCKET_NAME,
            Body: createReadStream(),               
            Key: `${uuidv4()}${path.extname(filename)}`,  
            ContentType: mimetype                   
        }).promise();     
        
        if(oldPdf)
            try {
                await s3.deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: oldPdf.split('/').pop()
                }).promise()
                console.log("file deleted Successfully")
            }
            catch (err) {
                console.log("ERROR in file Deleting : " + JSON.stringify(err))
            }
        
        console.log(Location);
        _pdf = Location;
        

        await CatalogModel.findByIdAndUpdate(pages.catalogId,{
            $set: {
                pdf: _pdf,
                status: CatalogStatus.PENDING
            }
        })

        return { result: true };
    }



    @Mutation(() => Boolean)
    async testPdf(): Promise<boolean> {
        var PDFImage = require("pdf-image").PDFImage;
        var pdfImage = new PDFImage("https://tanzeelat.s3.us-east-2.amazonaws.com/ab8a367c-0690-4140-bf4f-3030e2ce9dae.pdf");
         
        const imgPaths = await pdfImage.convertFile();
            console.log(imgPaths);
        return true;
    }
}
const storeFS = (stream: any, filename: any) => {
    const uploadDir = '/tmp';
    const path = `${uploadDir}/${filename}`;
    return new Promise((resolve, reject) =>
        stream
            .on('error', (error: any) => {
                if (stream.truncated)
                    // delete the truncated file
                    fs.unlinkSync(path);
                reject(error);
            })
            .pipe(fs.createWriteStream(path))
            .on('error', (error: any) => reject(error))
            .on('finish', () => resolve({ path }))
    );
}
