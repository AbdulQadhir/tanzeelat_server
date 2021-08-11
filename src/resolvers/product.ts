import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import { ProductFilters, ProductInput, ProductListResponse } from "../gqlObjectTypes/product.type";
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
        @Arg("productSubCategoryId") productSubCategoryId: string,
        @Arg("filter") filter: ProductFilters
    ): Promise<Product[]> {
        const products = await ProductModel.aggregate([
            {
                $match:{ 
                    'productSubCategoryId' : Types.ObjectId(productSubCategoryId)
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
                        {'name' :            { '$regex' : filter.name || '', '$options' : 'i' }},
                        {'vendor.shopname' : { '$regex' : filter.name || '', '$options' : 'i' }}
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
                      $first: "$productSubCategoryId"
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
                    from: 'productsubcategories',
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
    
    @Mutation(() => Boolean)
    async delProduct(
        @Arg("id") id: string
    ): Promise<Boolean> {   
        await ProductModel.findByIdAndDelete(id);
        return true;
    }

}
