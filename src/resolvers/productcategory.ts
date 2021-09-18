import "reflect-metadata";
import { ProductCategoryInput, ProductCategoryListOutput } from "../gqlObjectTypes/productcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import ProductCategoriesModel, { ProductCategories } from "../models/ProductCategories";
import ProductSubCategoriesModel from "../models/ProductSubCategory";

const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');
import { v4 as uuidv4 } from 'uuid';
 
@Resolver()
export class ProductCatagoriesResolver {
    @Query(() => [ProductCategories])
    async productCategories(): Promise<ProductCategories[]> {
        const cats = await ProductCategoriesModel.find();
        console.log(cats);
        return cats;
    }

    @Query(() => [ProductCategories])
    async productCategoriesDt(
        @Arg("search") search: string
    ): Promise<ProductCategories[]> {
        const cats = await ProductCategoriesModel.aggregate([
            {
                $lookup: {
                    from: 'productsubcategories',
                    localField: '_id',
                    foreignField: 'productCategoryId',
                    as: 'subcategories'
                }
            },
            {
                $match : {
                    $or : [
                        {"name": { "$regex": search, "$options": "i" }},
                        {"namear": { "$regex": search, "$options": "i" }},
                        {"subcategories.name": { "$regex": search, "$options": "i" }},
                        {"subcategories.namear": { "$regex": search, "$options": "i" }}
                    ]
                }
            }
        ]);
        return cats;
    }

    @Query(() => [ProductCategoryListOutput])
    async productCategoryList(): Promise<ProductCategoryListOutput[]> {
        const cats = await ProductSubCategoriesModel.aggregate([
            {
                $group: {
                    _id: "$productCategoryId",
                    productCategoryId: {
                      $first: "$productCategoryId"
                    },
                    subCategories: {
                      "$push": { name: "$name",namear: "$namear", id: "$_id" }
                    }
                }
            }
        ]);
        const res = await ProductSubCategoriesModel.populate(cats, {path: "productCategoryId"});
        return res;
    }

    @Mutation(() => ProductCategories)
    async addProductCategory(
        @Arg("input") input: ProductCategoryInput
    ): Promise<ProductCategories> {
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
        const user = new ProductCategoriesModel({
            name: input.name,
            namear: input.namear,
            image
        });
        const result = await user.save();
        return result;
    }

    @Mutation(() => Boolean)
    async updProductCategory(
        @Arg("input") input: ProductCategoryInput,
        @Arg("productCategoryId") productCategoryId: String
    ): Promise<Boolean> {
        const result = await ProductCategoriesModel.findByIdAndUpdate(productCategoryId, {
            $set: {
                name: input.name
            }
        })
        return result ? true : false;
    }
}
