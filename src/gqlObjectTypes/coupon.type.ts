import { Field, InputType, ObjectType } from "type-graphql";
import { Upload } from "./catalog.type";
import { GraphQLUpload } from "graphql-upload";

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

    @Field(() => [String])
    outlets: string[];

    @Field(()=> GraphQLUpload,{nullable: true})
    menu:  Upload;
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
    redeemed?: boolean

    
    @Field(()=> GraphQLUpload,{nullable: true})
    menu?:  Upload
}

@ObjectType()
export class CouponSummary {

    @Field({nullable: true})
    sent?: number

    @Field({nullable: true})
    redeemed?: number
}
