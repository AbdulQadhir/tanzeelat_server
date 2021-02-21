import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CouponModel, { Coupon } from "../models/Coupon";
import { CouponInput } from "..//gqlObjectTypes/coupon.type";

 
@Resolver()
export class CouponResolver {
    
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
