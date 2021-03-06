import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CouponModel, { Coupon } from "../models/Coupon";
import { CouponInput } from "..//gqlObjectTypes/coupon.type";
import CouponCategoriesModel from "../models/CouponCategories";
import { Vendor } from "../models/Vendor";
import { Types } from "mongoose";

@Resolver()
export class CouponResolver {
    
    @Query(() => [Vendor])
    async vendorsWithCoupons(
        @Arg("category") categoryId : string
    ): Promise<Vendor[]> {
        const vendors = await CouponCategoriesModel.aggregate([
            {
                $match:{
                    _id: Types.ObjectId(categoryId)
                }
            },
            {
                $lookup: {
                    from: 'coupons',
                    localField: '_id',
                    foreignField: 'couponCategoryId',
                    as: 'coupons'
                }
            },
            {
                $unwind: {
                    path: "$coupons",
                    preserveNullAndEmptyArrays: false
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
        @Arg("vendorId") vendorId : String
    ): Promise<Coupon[]> {
        return await CouponModel.find({vendorId});
    }
    
    @Query(() => Coupon)
    async couponDt(
        @Arg("id") id : String
    ): Promise<Coupon> {
        return await CouponModel.findById(id);
    }

    @Mutation(() => Coupon)
    async addCoupon(
        @Arg("input") input: CouponInput
    ): Promise<Coupon> {
        const coupon = new CouponModel({...input});
        const result = await coupon.save();
        return result;
    }
}
