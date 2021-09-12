import { Field, InputType, ObjectType } from "type-graphql";
import { Upload } from "./catalog.type";
import { GraphQLUpload } from "graphql-upload";
import { Vendor } from "../models/Vendor";
import { Coupon } from "../models/Coupon";

@InputType({ description: "New Coupon data" })
export class CouponInput {

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    startDate: string;

    @Field()
    endDate: string;

    @Field()
    vendorId: string;

    @Field()
    couponCategoryId: string;

    @Field({nullable: true})
    couponSubCategoryId?: string;

    @Field(() => [String])
    outlets: string[];

    @Field(()=> GraphQLUpload,{nullable: true})
    menu:  Upload;

    @Field(()=> Number,{nullable: true})
    redeemLimit: Number;
}

@InputType({ description: "Coupon filter" })
export class CouponFilterInput {

    @Field()
    id: string;

    @Field()
    state: string;

    @Field()
    search: string;

    @Field(()=>[Number],{nullable: true})
    coordinates?: [Number];
}

@ObjectType()
export class CouponUnveil {

    @Field({nullable: true})
    userId?: string

    @Field({nullable: true})
    couponId?: string

    @Field({nullable: true})
    name?: string

    @Field({nullable: true})
    coupon?: string

    @Field({nullable: true})
    description?: string

    @Field({nullable: true})
    redeemed?: boolean

    
    @Field(()=> GraphQLUpload,{nullable: true})
    menu?:  Upload
}

@ObjectType()
export class CouponRedeemOutput {

    @Field({nullable: true})
    result?: Boolean

    @Field({nullable: true})
    error?: string
}

@ObjectType()
export class CouponSummary {

    @Field({nullable: true})
    sent?: number

    @Field({nullable: true})
    redeemed?: number
}

@ObjectType()
export class CouponFilterOutput {

    @Field()
    _id?: string

    @Field(()=>Number,{nullable: true})
    distance?: Number

    @Field(()=>Vendor)
    vendor?: Vendor

    @Field(()=>Coupon)
    coupon?: Coupon
}
