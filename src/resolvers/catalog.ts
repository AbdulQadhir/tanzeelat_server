import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql"
import CatalogModel, { Catalog } from "../models/Catalog";
import { CatalogInput, UpdPagesInput, UploadRespType, CatalogFilters, CatalogOutput } from "../gqlObjectTypes/catalog.type";
import { v4 as uuidv4 } from 'uuid';
import { Types } from "mongoose";
import { Context } from "vm";
import { checkVendorAccess } from "./auth";

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
            throw new Error("Unauthorized!");

        return await CatalogModel.find({vendorId});
    }
    
    @Query(() => [CatalogOutput])
    async activeCatalogs(
        @Arg("filter") filter: CatalogFilters
    ): Promise<CatalogOutput[]> {
        let filters : any = {};
        if(filter?.vendorId)
            filters["vendorId._id"] = Types.ObjectId(filter.vendorId);
        if(filter?.category)
            filters.catalogCategoryId = filter.category;
        if(filter?.search)
            filters.title = { "$regex": filter.search, "$options": "i" }
        if(filter?.state)
            filters["outlets.state"] = filter.state;
            
        const catalogs = await CatalogModel.aggregate([
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
                    as: 'vendorId'
                }
            },
            {
                $unwind: {
                    path: "$vendorId"
                }
            },
            {
                $match:{
                //    expiry: { $gte : new Date() },
                    ...filters
                }
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
                pages: _pages
            }
        })

        return { result: true };
    }
}
