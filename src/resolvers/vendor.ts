import "reflect-metadata";
import { VendorLoginInput, VendorLoginResponse, AddVendorInput, VendorExtra } from "../gqlObjectTypes/vendor.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import VendorModel, {Vendor} from "../models/Vendor"
import { v4 as uuidv4 } from 'uuid';
import CatalogModel from "../models/Catalog";
import CouponModel from "../models/Coupon";

const bcrypt = require('bcrypt');
const saltRounds = 10;

const fs   = require('fs');
const jwt  = require('jsonwebtoken');

const path = require("path");
 
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';

const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');

 
@Resolver()
export class VendorResolver {
    @Query(() => [Vendor])
    async vendors(): Promise<Vendor[]> {
        return await VendorModel.find();
    }

    @Query(() => Vendor)
    async vendorDt(
        @Arg("id") id : String
    ): Promise<Vendor> {
        const vendor = await VendorModel.findById(id);
        return vendor;
    }

    @Query(() => VendorExtra)
    async vendorDtExtra(
        @Arg("id") id : String
    ): Promise<VendorExtra> {
        const catalogs = await CatalogModel.count({vendorId: id});
        const coupons = await CouponModel.count({vendorId: id});
        return {
            coupons: coupons || 0,
            catalogs: catalogs || 0
        }
    }

    @Query(() => VendorLoginResponse)
    async loginVendor(
        @Arg("input") input : VendorLoginInput 
    ): Promise<VendorLoginResponse>{
        
        const user = await VendorModel.findOne({username: input.username});
        if(!user)
            return {
                errors : [{message: "Invalid Login"}]
            }

        const match = await bcrypt.compare(input.password, user.password);
        if(match)
        {
            var privateKEY  = fs.readFileSync('src/keys/private.key', 'utf8');
            var i  = 'tanzeelat';          // Issuer 
            var s  = 'tanzeelat';        // Subject 
            var a  = 'tanzeelat'; // Audience// SIGNING OPTIONS
            var signOptions = {
             issuer:  i,
             subject:  s,
             audience:  a,
             expiresIn:  "12h",
             algorithm:  "RS256"
            };
            var payload = {
                userId: user._id
            };
            var token = jwt.sign(payload, privateKEY, signOptions);
            return {
                token
            }
        }
        else
            return {
                errors : [{message: "Invalid Login"}]
            }
    }

    @Mutation(() => Vendor)
    async updateVendor(
        @Arg("input") input: AddVendorInput,
        @Arg("id") id: String
    ): Promise<Vendor> {
        let replace : any = {};
        replace = {
            $set:{
                shopname : input.shopname,
                username :  input.username,
                brandname :  input.brandname,
                category : input.category,
                tradelicense :  input.tradelicense,
                emiratesid :  input.emiratesid,
                ownername :  input.ownername,
                ownerphone :  input.ownerphone,
                owneremail :  input.owneremail,
                contactname :  input.contactname,
                contactphone :  input.contactphone,
                contactmobile :  input.contactmobile,
                contactemail :  input.contactemail
            }
        }
        
        if(input.password)
        {
            const hashedPass = await bcrypt.hash(input.password, saltRounds);
            replace.$set["password"] = hashedPass;
        }

        if(input.logo)
        {
            const user = await VendorModel.findById(id);
            
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET
            });
    
            const { createReadStream, filename, mimetype } = await input.logo;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();       

            if(user.logo)
                try {
                    await s3.deleteObject({
                        Bucket: BUCKET_NAME,
                        Key: user.logo.split('/').pop()
                    }).promise()
                    console.log("file deleted Successfully")
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err))
                }
            
            console.log(Location);
            replace.$set["logo"] = Location;
        }

        const result = await VendorModel.findByIdAndUpdate(id, replace);
        return result;
    }

    @Mutation(() => Vendor)
    async registerVendor(
        @Arg("input") input: AddVendorInput
    ): Promise<Vendor> {
        const user = new VendorModel({...input});

        const hashedPass = await bcrypt.hash(input.password, saltRounds);
        user.password = hashedPass;
        const result = await user.save();

        return result;
    }
}