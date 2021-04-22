import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx, } from "type-graphql"
import CouponModel, { Coupon } from "../models/Coupon";
import { CouponInput, CouponSummary } from "..//gqlObjectTypes/coupon.type";
import { Vendor } from "../models/Vendor";
import { Types } from "mongoose";
import UserCouponModel from "../models/UserCoupon";
import { Context } from "@apollo/client";
import { v4 as uuidv4 } from 'uuid';
const path = require("path");
const AWS = require('aws-sdk');
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';
const BUCKET_NAME = 'tanzeelat';
@Resolver()
export class CouponResolver {
    
    @Query(() => [Vendor])
    async vendorsWithCoupons(
        @Arg("subcategory") subCategoryId : string,
        @Ctx() ctx: Context
    ): Promise<Vendor[]> {

        const userId = ctx.userId || "";

        const vendors = await UserCouponModel.aggregate([
            {
                $match:{
                    userId: Types.ObjectId(userId),
                    redeemed: false
                }
            },
            {
                $lookup:{
                    from: 'coupons',
                    localField: 'couponId',
                    foreignField: '_id',
                    as: 'coupons'
                }
            },
            {
                $unwind:{
                    path: "$coupons"
                }
            },
            {
                $match:{
                    "coupons.couponSubCategoryId": Types.ObjectId(subCategoryId)
                }
            },
            {
                $group:{
                    _id: "$coupons.vendorId",
                    vendorId: {
                      $first: "$coupons.vendorId"
                    }
                }
            },
            {
                $lookup:{
                    from: 'vendors',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            {
                $unwind:{
                    path: "$vendor"
                }
            },
            {
                $project:{
                    "shopname": "$vendor.shopname",
                    "logo": "$vendor.logo"
                }
            }
        ]);
        
        return vendors;
    }
    
    @Query(() => [Coupon])
    async coupons(
        @Arg("vendorId") vendorId : string,
        @Arg("subCategoryId") subCategoryId : string,
        @Ctx() ctx: Context
    ): Promise<Coupon[]> {

        const userId = ctx.userId || "";

        const coupons = await UserCouponModel.aggregate([
            {
                $match:{
                    userId: Types.ObjectId(userId),
                    redeemed: false
                }
            },
            {
                $lookup:{
                    from: 'coupons',
                    localField: 'couponId',
                    foreignField: '_id',
                    as: 'coupons'
                }
            },
            {
                $unwind:{
                    path: "$coupons"
                }
            },
            {
                $match:{
                    "coupons.couponSubCategoryId": Types.ObjectId(subCategoryId),
                    "coupons.vendorId" : Types.ObjectId(vendorId),
                }
            },
            {
                $project:{
                    "_id": "$coupons._id",
                    "name": "$coupons.name",
                    "description": "$coupons.description",
                    "userCouponId": "$_id"
                }
            }
        ]);
        
        return coupons;
    }
    
    @Query(() => [Coupon])
    async couponsOfVendor(
        @Arg("vendorId") vendorId : string
    ): Promise<Coupon[]> {

        const coupons = await CouponModel.find({vendorId})
        return coupons;
    }
    
    @Query(() => Coupon)
    async couponDt(
        @Arg("id") id : String
    ): Promise<Coupon> {
        return await CouponModel.findById(id);
    }
    
    @Query(() => CouponSummary)
    async couponSummary(
        @Arg("id") id: String
    ): Promise<CouponSummary> {
        const sent = await UserCouponModel.count({couponId: id});
        const redeemed = await UserCouponModel.count({couponId: id,redeemed: true});
        return {
            sent: sent || 0,
            redeemed: redeemed || 0
        }
    }

    @Mutation(() => Coupon)
    async addCoupon(
        @Arg("input") input: CouponInput
    ): Promise<Coupon> {
        console.log(input);
        let menu = "";
        if(input.menu)
        {
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET
            });  
            const { createReadStream, filename, mimetype } = await input.menu;
            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();           
            console.log(Location);
            menu = Location;
        }
        const coupon = new CouponModel({...input,menu});
        const result = await coupon.save();
        return result;
    }

    @Mutation(() => Coupon)
    async updateCoupon(
        @Arg("input") input: CouponInput,
        @Arg("id") id: string
    ): Promise<Coupon> {
        let replace : any = {};
        replace = {
        // const result = await CouponModel.findByIdAndUpdate(id,{
            $set:{
                name: input.name,
                description: input.description,
                startDate: input.startDate,
                endDate: input.endDate,
                couponCategoryId: input.couponCategoryId,
                outlets: input.outlets
            }
        } 
        if(input.menu)
        {
            const user = await CouponModel.findById(id);
            
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET
            });
    
            const { createReadStream, filename, mimetype } = await input.menu;

            const { Location } = await s3.upload({ // (C)
                Bucket: BUCKET_NAME,
                Body: createReadStream(),               
                Key: `${uuidv4()}${path.extname(filename)}`,  
                ContentType: mimetype                   
            }).promise();       

            if(user.menu)
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
            replace.$set["menu"] = Location;
            } 
        const result = await CouponModel.findByIdAndUpdate(id, replace);
        return result;     
        // });
        // return result;
    }
}
