import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import { ProductBulkInput, ProductBulkListInput, ProductFilters, ProductInput, ProductListResponse } from "../gqlObjectTypes/product.type";
import { v4 as uuidv4 } from 'uuid';
import ProductModel, { Product } from "../models/Products";
import { Types } from "mongoose";

const path = require("path");

const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');

@Resolver()
export class ProductResolver {
    @Query(() => [Product])
    async allProducts(
        @Arg("filter") filter: ProductFilters
    ): Promise<Product[]> {

        console.log(filter);

       const filterCategory = filter.productCategoryId != "0" ? {
            "productCategoryId" : Types.ObjectId(filter.productCategoryId)
        } : {};

        const products = await ProductModel.aggregate([
            {
                $match:{ 
                    ...filterCategory
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
            },
            {
                $match:{ 
                    $or : [
                        {'name' :            { '$regex' : filter.search || '', '$options' : 'i' }},
                        {'vendor.shopname' : { '$regex' : filter.search || '', '$options' : 'i' }}
                    ]
                },
            }
        ]);
        return products;
    }
    
    @Query(() => [ProductListResponse])
    async productsByVendor(
        @Arg("vendorId") vendorId: string
    ): Promise<ProductListResponse[]> {
        console.log(vendorId);
        return await ProductModel.aggregate([
            {
                $match: {
                    "vendorId": Types.ObjectId(vendorId)
                }
            },
            {
                $group: {
                    _id: "$productSubCategoryId",
                    productSubCategoryId: {
                      $first: "$productCategoryId"
                      },
                    products: {
                      "$push": { 
                        id: "$_id",
                        name: "$name",
                        image: "$image"
                      }
                    }
                }
            },
            {
                $lookup: {
                    from: 'productcategories',
                    localField: 'productSubCategoryId',
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },
            {
                $unwind: {
                    path: "$subcategory",
                }
            },
            {
                $project: {
                    "subcategoryId": "$productSubCategoryId",
                    "subcategory": "$subcategory.name",
                    products : 1
                }
            }
        ]);
    }
    
    @Query(() => [Product])
    async productsInCatalog(
        @Arg("input") input: ProductBulkListInput,
    ): Promise<Product[]> {
        return await ProductModel.aggregate([
            {
                $match: {
                    "catalogId": Types.ObjectId(input.catalogId),
                    pageNo: input.pageNo
                }
            },
            {
                $lookup: {
                    from: 'productcategories',
                    localField: 'productCategoryId',
                    foreignField: '_id',
                    as: 'productCategory'
                }
            },
            {
                $unwind: {
                    path: "$productCategory",
                }
            }
        ]);
    }
    
    @Mutation(() => Product)
    async addProduct(
        @Arg("input") input: ProductInput
    ): Promise<Product> {

        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });

        let image = "";

        if(input.image)
        {
            const { createReadStream, filename, mimetype } = await input.image;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();    
            
            console.log(Location);
            image = Location;
        }

        const product = new ProductModel({
            name: input.name,
            namear: input.namear,
            price: input.price,
            offerPrice: input.offerPrice,
            vendorId: input.vendorId,
            productCategoryId: input.productCategoryId,
            productSubCategoryId: input.productSubCategoryId,
            image
        })

        const result = await product.save();
        return result;
    }
    
    @Mutation(() => Product)
    async addProductBulk(
        @Arg("input") input: ProductBulkInput
    ): Promise<Product> {

        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });

        let image = "";

        if(input.image)
        {
            const { createReadStream, filename, mimetype } = await input.image;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();    
            
            console.log(Location);
            image = Location;
        }

        const product = new ProductModel({
            name: input.name,
            namear: input.namear,
            price: input.price,
            offerPrice: input.offerPrice,
            vendorId: input.vendorId,
            catalogId: input.catalogId,
            pageNo: input.pageNo,
            productCategoryId: input.productCategoryId,
            productSubCategoryId: input.productSubCategoryId,
            image
        })

        const result = await product.save();
        return result;
    }
    
    @Mutation(() => Boolean)
    async delProduct(
        @Arg("id") id: string
    ): Promise<Boolean> {   

        const product = await ProductModel.findById(id);

        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });

        if(product.image)
        try {
            await s3.deleteObject({
                Bucket: BUCKET_NAME,
                Key: product.image.split('/').pop()
            }).promise()
            console.log("file deleted Successfully")
        }
        catch (err) {
            console.log("ERROR in file Deleting : " + JSON.stringify(err))
        }
        
        await ProductModel.findByIdAndDelete(id);
        return true;
    }

}
