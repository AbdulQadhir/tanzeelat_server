import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import UserCouponModel from "../models/UserCoupon";
import { String } from "aws-sdk/clients/cloudsearch";
import {CouponUnveil} from "../gqlObjectTypes/coupon.type"
import { Types } from "mongoose";
 
@Resolver()
export class UserCouponResolver {
    @Mutation(() => Boolean)
    async redeemCoupon(
        @Arg("couponId") couponId: String,
        @Arg("userId") userId: String,
    ): Promise<Boolean> {
        const coupon = new UserCouponModel({couponId, userId});
        await coupon.save();
        return coupon ? true : false;
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
