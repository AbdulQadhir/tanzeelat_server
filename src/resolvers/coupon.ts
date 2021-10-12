import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx, } from "type-graphql"
import CouponModel, { Coupon } from "../models/Coupon";
import { CouponFilterInput, CouponFilterOutput, CouponInput, CouponSummary } from "..//gqlObjectTypes/coupon.type";
import { Types } from "mongoose";
import UserCouponModel from "../models/UserCoupon";
import { Context } from "@apollo/client";
import { v4 as uuidv4 } from 'uuid';
import VendorOutletModel from "../models/VendorOutlet";
import computeDistance from "../utils/Geo";

const path = require("path");
const AWS = require('aws-sdk');
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';
const BUCKET_NAME = 'tanzeelat';
@Resolver()
export class CouponResolver {
    
    @Query(() => [CouponFilterOutput])
    async couponsWithFilter(
        @Arg("filter") filter : CouponFilterInput,
       // @Ctx() ctx: Context
    ): Promise<CouponFilterOutput[]> {

       // const userId = ctx.userId || "";

       console.log(filter);

       const filterState = filter.state != "" ? {
           "state" : filter.state
       } : {};

       const filterCategory = filter.id != "0" ? {
           "coupon.couponCategoryId" : Types.ObjectId(filter.id)
       } : {};

       const filterSearch = filter.search != "" ? {
           $or : [
            {"vendor.shopname": { "$regex": filter.search, "$options": "i" }},
            {"coupon.name": { "$regex": filter.search, "$options": "i" }},
           ]
        } : {};

        const sortBy = filter.sortBy ? filter.sortBy == "new" ? 
                {
                    "coupon.startDate": 1
                } : 
                filter.sortBy == "near" ?
                {
                    "distance": 1
                } : filter.sortBy == "featured" ?
                    {
                            "coupon.featured": 1
                    }: {"coupon.startDate": 1} : {"coupon.startDate": 1};

       const filterDistance : any = filter.coordinates ? {
            $geoNear: {
                near: { type: "Point", coordinates: filter.coordinates },
                distanceField: "distance",
                spherical: true
            }
        } : {};

       let aggregation = [
            {
                $match: {
                    ...filterState
                }
            },
            {
                $lookup:{
                    from: 'coupons',
                    localField: '_id',
                    foreignField: 'outlets',
                    as: 'coupon'
                }
            },
            {
                $unwind:{
                    path: "$coupon",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match:{
                    ...filterCategory
                }
            },
            {
                $group:{
                    _id: "$coupon._id",
                    outletname: {
                    "$first": "$name",
                    },        
                    place: {
                    "$first": "$place"
                    },
                    distance: {
                    "$first": "$distance"
                    },
                    count: {
                    "$sum": 1
                    },
                    vendorId: {
                    "$first": "$vendorId"
                    },
                    coupon: {
                    "$first" : "$coupon"
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
                    distance:1,
                    "vendor._id": "$vendor._id",
                    "vendor.shopname": "$vendor.shopname",
                    "vendor.logo": "$vendor.logo",
                    "coupon.name": "$coupon.name",
                    "coupon.redeemLimit": "$coupon.redeemLimit",
                    "coupon.description": "$coupon.description",
                    "coupon.endDate": "$coupon.endDate",
                    "coupon.startDate": "$coupon.startDate",
                    "coupon.featured": "$coupon.featured",
                }
            },
            {
                $match : {
                    ...filterSearch
                }
            },
            {
                $sort : {
                    ...sortBy
                }
            }
        ];
        if(filter.coordinates)
            aggregation = [filterDistance,...aggregation]

        const coupons = await VendorOutletModel.aggregate(aggregation);
        
        return coupons;
    }
    
    @Query(() => [Coupon])
    async otherCouponsOfVendor(
        @Arg("couponId") couponId : string,
       // @Ctx() ctx: Context
    ): Promise<Coupon[]> {

       // const userId = ctx.userId || "";

        const coupon = await CouponModel.findById(couponId);
        const vendorId = coupon.vendorId;

        const coupons = await CouponModel.aggregate([
            {
                $match: {
                    vendorId : Types.ObjectId(vendorId),
                    "_id": { $ne : Types.ObjectId(couponId) }
                }
            }
        ]);
        
        return coupons;
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
    async couponFullDt(
        @Arg("id") id : string,
        @Arg("coordinates") coordinates : string
    ): Promise<Coupon> {
        let coupons = await CouponModel.aggregate([
            {
                $match: {
                    "_id" : Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'vendoroutlets',
                    localField: 'outlets',
                    foreignField: '_id',
                    as: 'outletsDt'
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
            }
        ]);

        if(coordinates != ""){

            const strs = coordinates.split(",");
            const userLoc = [parseFloat(strs[0]) || 0, parseFloat(strs[1]) || 0];

            const tmp = coupons.length>0 && coupons[0].outletsDt?.map((outlet: any) => {
                return {
                    ...outlet,
                    distance: computeDistance(userLoc,outlet?.location?.coordinates || [0,0])
                };
            })

            let cpn = coupons.length>0 && coupons[0];
            cpn.outletsDt = tmp;

            return cpn;
        }
        else
            return coupons.length>0 && coupons[0];
    }
    
    @Query(() => Coupon)
    async couponDt(
        @Arg("id") id : string
    ): Promise<Coupon> {
        const coupons = await CouponModel.aggregate([
            {
                $match: {
                    _id: Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'vendoroutlets',
                    localField: 'outlets',
                    foreignField: '_id',
                    as: 'outletsDt'
                }
            },
        ]);
        return coupons[0];
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
                namear: input.namear,
                description: input.description,
                descriptionar: input.descriptionar,
                startDate: input.startDate,
                endDate: input.endDate,
                couponCategoryId: input.couponCategoryId,
                couponSubCategoryId: input.couponSubCategoryId,
                outlets: input.outlets,
                redeemLimit: input.redeemLimit
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
