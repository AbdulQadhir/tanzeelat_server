import { Field, InputType } from "type-graphql";
import { Upload } from "./catalog.type";
import { GraphQLUpload } from "graphql-upload";

@InputType({ description: "New Coupon Category data" })
export class CouponCategoryInput {

    @Field()
    name: string;

    @Field(() => GraphQLUpload,{nullable: true})
    image: Upload;
}


@InputType({ description: "New Coupon sub Category data" })
export class CouponSubCategoryInput {

    @Field()
    name: string;

    @Field(() => GraphQLUpload,{nullable: true})
    image: Upload;

    @Field()
    couponCategoryId: string;
}