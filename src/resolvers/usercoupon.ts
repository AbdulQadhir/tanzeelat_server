import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import UserCouponModel from "../models/UserCoupon";
import { String } from "aws-sdk/clients/cloudsearch";
import UserModel from "../models/User";
import {CouponUnveil} from "../gqlObjectTypes/coupon.type"
import { Types } from "mongoose";
 
@Resolver()
export class UserCouponResolver {
    @Query(() => Number)
    async couponsSent(
        @Arg("id") id: String
    ): Promise<number> {
        const couponsSent = await UserCouponModel.count({couponId:id});
        return couponsSent || 0;
    }

    @Mutation(() => Number)
    async distributeCoupon(
        @Arg("id") couponId: String
    ): Promise<Number> {
        const users = await UserModel.find({});
        for (const user of users) {
            const coupon = new UserCouponModel({couponId, userId: user._id});
            await coupon.save();
        }
        return users.length;
    }

    @Mutation(() => Boolean)
    async redeemCoupon(
        @Arg("id") id: String
    ): Promise<Boolean> {
        const result = await UserCouponModel.findByIdAndUpdate(id, {redeemed: true});
        return result ? true : false;
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
                    "redeemed": 1
                }
            }
        ])
        return result?.length>0 ? result[0] : null;
    }
}
