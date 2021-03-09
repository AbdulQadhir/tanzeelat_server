import "reflect-metadata";
import { CouponCategoryInput } from "../gqlObjectTypes/couponcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CouponCategoriesModel, {CouponCategories} from "../models/CouponCategories"

const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');
import { v4 as uuidv4 } from 'uuid';
 
@Resolver()
export class CouponCatagoriesResolver {
    @Query(() => [CouponCategories])
    async couponCategories(): Promise<CouponCategories[]> {
        const cats = await CouponCategoriesModel.find();
        return cats;
    }

    @Mutation(() => CouponCategories)
    async addCouponCategory(
        @Arg("input") input: CouponCategoryInput
    ): Promise<CouponCategories> {
        let image = "";
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
        const user = new CouponCategoriesModel({
            name: input.name,
            image
        });
        const result = await user.save();
        return result;
    }
}
