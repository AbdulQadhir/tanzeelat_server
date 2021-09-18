import "reflect-metadata";
import { CouponSubCategoryInput } from "../gqlObjectTypes/couponcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CouponSubCategoriesModel, {CouponSubCategories} from "../models/CouponSubCategories";
import { v4 as uuidv4 } from 'uuid';

const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');
 
@Resolver()
export class CouponSubCatagoriesResolver {
    @Query(() => [CouponSubCategories])
    async couponSubCategories(
        @Arg("id") id: string
    ): Promise<CouponSubCategories[]> {
        const cats = await CouponSubCategoriesModel.find({couponCategoryId:id});
        return cats;
    }

    @Mutation(() => CouponSubCategories)
    async addCouponSubCategory(
        @Arg("input") input: CouponSubCategoryInput
    ): Promise<CouponSubCategories> {
        console.log(input);
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });

        let image = "";

        if(input.image)
        {
            const { createReadStream, filename, mimetype } = await input.image;

            const { Location } = await s3.upload({ 
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();    
            
            console.log(Location);
            image = Location;
        }

        const item = new CouponSubCategoriesModel({
            name: input.name,
            namear: input.namear,
            couponCategoryId:input.couponCategoryId,
            image
        });

        const result = await item.save();
        console.log(item);
        return result;
    }
}
