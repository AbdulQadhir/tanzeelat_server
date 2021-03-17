import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import { ProductInput } from "../gqlObjectTypes/product.type";
import { v4 as uuidv4 } from 'uuid';
import ProductModel, { Product } from "../models/Products";

const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');

@Resolver()
export class ProductResolver {
    
    @Query(() => [Product])
    async allProducts(): Promise<Product[]> {
        return await ProductModel.find({});
    }
    
    @Query(() => [Product])
    async productsByVendor(
        @Arg("vendorId") vendorId: string
    ): Promise<Product[]> {
        return await ProductModel.find({vendorId});
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
            vendorId: input.vendorId,
            productCategoryId: input.productCategoryId,
            productSubCategoryId: input.productSubCategoryId,
            image
        })

        const result = await product.save();
        return result;
    }

}
