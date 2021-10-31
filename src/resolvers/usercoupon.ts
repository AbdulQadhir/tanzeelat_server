import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql"
import UserCouponModel from "../models/UserCoupon";
import { String } from "aws-sdk/clients/cloudsearch";
import {CouponRedeemOutput, CouponUnveil} from "../gqlObjectTypes/coupon.type"
import { Types } from "mongoose";
import { Context } from "vm";
import VendorUserModel from "../models/VendorUser";
import CouponModel from "../models/Coupon";

const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const moment = require("moment");

@Resolver()
export class UserCouponResolver {
    @Mutation(() => CouponRedeemOutput)
    async redeemCoupon(
        @Arg("couponString") couponString: String,
        @Ctx() ctx: Context
    ): Promise<CouponRedeemOutput> {
        console.log(couponString);
        if(couponString == "Invalid Coupon")
            return {
                result: false,
                error: "Invalid Coupon"
            };

        const strs = couponString.split(";");
        if(strs.length == 0)
            return {
                result: false,
                error: "Invalid Coupon"
            };

        const couponId = strs[0];
        const custToken = strs[1];

        var userId = "";
        var vendorUserId = ctx.userId;

        var publicKEY  = fs.readFileSync('src/keys/public.key', 'utf8');
        try {
            var decoded = jwt.verify(custToken,  publicKEY, {ignoreExpiration: true});
            if(decoded?.userId)
                userId = decoded?.userId;
        } catch(err) {
            console.log("err",err)
        }

        console.log(userId);

        const vendorUser = await VendorUserModel.findById(vendorUserId);
        const outletId = vendorUser.outlets[0] || "";

        const coupon = await CouponModel.findById(couponId);
        if(!coupon)
            return {
                result: false,
                error: "Invalid Coupon"
            };
        
        if(!coupon.outlets.includes(outletId))
            return {
                result: false,
                error: "Coupon not available here"
            };
        
        var now = moment();
        if(!now > moment(coupon.expiry))
            return {
                result: false,
                error: "Coupon Expired"
            };

        const exists = await UserCouponModel.countDocuments({
            couponId,
            userId
        });

        if(exists > 0)
            return {
                result: false,
                error: "This coupon is already redeemed once"
            };

        const redeem = new UserCouponModel({
            couponId, 
            userId,
            vendorUserId,
            outletId
        });
        await redeem.save();
        
        return {
            result: true
        };
    }

    @Query(() => CouponUnveil)
    async unveilUserCoupon(
        @Arg("id") id: String
    ): Promise<CouponUnveil> {
        const result = await UserCouponModel.aggregate([
            {
                $match: {
                    _id: Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'coupons',
                    localField: 'couponId',
                    foreignField: '_id',
                    as: 'coupon'
                }
            },
            {
                $unwind: {
                    path: "$coupon"
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: "$user",
                }
            },
            {
                $project:{
                    "userId": "$user._id",
                    "couponId": "$coupon._id",
                    "name": "$user.name",
                    "coupon": "$coupon.name",
                    "description": "$coupon.description",
                    "redeemed": 1
                }
            }
        ])
        return result?.length>0 ? result[0] : null;
    }
}
