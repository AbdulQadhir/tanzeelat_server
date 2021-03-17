import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx, } from "type-graphql"
import CouponModel, { Coupon } from "../models/Coupon";
import { CouponInput, CouponSummary } from "..//gqlObjectTypes/coupon.type";
import { Vendor } from "../models/Vendor";
import { Types } from "mongoose";
import UserCouponModel from "../models/UserCoupon";
import { Context } from "@apollo/client";

@Resolver()
export class CouponResolver {
    
    @Query(() => [Vendor])
    async vendorsWithCoupons(
        @Arg("category") categoryId : string,
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
                    "coupons.couponCategoryId": Types.ObjectId(categoryId)
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
                    "shopname": "$vendor.shopname"
                }
            }
        ]);
        
        return vendors;
    }
    
    @Query(() => [Coupon])
    async coupons(
        @Arg("vendorId") vendorId : string,
        @Arg("categoryId") categoryId : string,
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
                    "coupons.couponCategoryId": Types.ObjectId(categoryId),
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
        const coupon = new CouponModel({...input});
        const result = await coupon.save();
        return result;
    }

    @Mutation(() => Coupon)
    async updateCoupon(
        @Arg("input") input: CouponInput,
        @Arg("id") id: string
    ): Promise<Coupon> {
        const result = await CouponModel.findByIdAndUpdate(id,{
            $set:{
                name: input.name,
                description: input.description,
                startDate: input.startDate,
                endDate: input.endDate,
                couponCategoryId: input.couponCategoryId,
                outlets: input.outlets
            }
        });
        return result;
    }
}
