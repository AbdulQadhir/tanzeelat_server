import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import WarrantyCardModel, { WarrantyCard } from "../models/WarrantyCard";
import { v4 as uuidv4 } from 'uuid';
import { WarrantyCardInput } from "../gqlObjectTypes/warranrycard.types";

const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');

@Resolver()
export class WarrantyCardResolver {
    
    @Query(() => [WarrantyCard])
    async warrantyCards(
        @Arg("userId") userId : String
    ): Promise<WarrantyCard[]> {
        return await WarrantyCardModel.find({userId});
    }
    
    @Mutation(() => WarrantyCard)
    async addWarrantyCard(
        @Arg("input") input: WarrantyCardInput
    ): Promise<WarrantyCard> {

        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });

        let image1= "";
        let image2= "";
        let image3= "";

        if(input.image1)
        {
            const { createReadStream, filename, mimetype } = await input.image1;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();     

            image1 = Location;
        }

        if(input.image2)
        {
            const { createReadStream, filename, mimetype } = await input.image2;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();     
              
            image1 = Location;
        }

        if(input.image3)
        {
            const { createReadStream, filename, mimetype } = await input.image3;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();     
              
            image1 = Location;
        }
        const warrantyCard = new WarrantyCardModel({...input, image1, image2, image3});
        const result = await warrantyCard.save()
        return result;
    }

}
