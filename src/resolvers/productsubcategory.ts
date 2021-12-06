import "reflect-metadata";
import { ProductSubCategoryInput} from "../gqlObjectTypes/productcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import ProductSubCategoriesModel, { ProductSubCategories } from "../models/ProductSubCategory";
 
const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');
import { v4 as uuidv4 } from 'uuid';

@Resolver()
export class ProductSubCatagoriesResolver {
    @Query(() => [ProductSubCategories])
    async productSubCategories(
        @Arg("id") id: string
    ): Promise<ProductSubCategories[]> {
        const cats = await ProductSubCategoriesModel.find({productCategoryId:id});
        return cats;
    }

    @Mutation(() => ProductSubCategories)
    async addProductSubCategory(
        @Arg("input") input: ProductSubCategoryInput
    ): Promise<ProductSubCategories> {
        
        let image = "";
        console.log(input);
        if(input.image)
        {
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET
            });

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
        const user = new ProductSubCategoriesModel({
            name: input.name,
            namear: input.namear,
            productCategoryId: input.productCategoryId,
            image
        });
        const result = await user.save();
        return result;
    }

    @Mutation(() => ProductSubCategories)
    async updProductSubCategory(
        @Arg("input") input: ProductSubCategoryInput,
        @Arg("id") id: string
    ): Promise<ProductSubCategories> {
        let replace : any = {};
        replace = {
            $set:{
                name: input.name,
                namear: input.namear,
                productCategoryId: input.productCategoryId
            }
        } 
        if(input.image)
        {
            const user = await ProductSubCategoriesModel.findById(id);
            
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET
            });
    
            const { createReadStream, filename, mimetype } = await input.image;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();       

            if(user.image)
                try {
                    await s3.deleteObject({
                        Bucket: BUCKET_NAME,
                        Key: user.image.split('/').pop()
                    }).promise()
                    console.log("file deleted Successfully")
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err))
                }
            console.log(Location);
            replace.$set["image"] = Location;
            } 
        const result = await ProductSubCategoriesModel.findByIdAndUpdate(id, replace);
        return result;     
    }

    @Query(() => ProductSubCategories)
    async productSubCategoryDt(
        @Arg("id") id : String
    ): Promise<ProductSubCategories> {
        const ProductSubCategory = await ProductSubCategoriesModel.findById(id);
        return ProductSubCategory;
    }
}
