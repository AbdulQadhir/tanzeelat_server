// import { CouponSubCategories } from "../models/CouponSubCategories";
import { Field, InputType } from "type-graphql";
import { Upload } from "./catalog.type";
import { GraphQLUpload } from "graphql-upload";
// import { CouponCategories } from "../models/CouponCategories";

@InputType({ description: "New Coupon Category data" })
export class CouponCategoryInput {

    @Field()
    name: string;

    @Field(() => GraphQLUpload,{nullable: true})
    image: Upload;

}


// @ObjectType({ description: "Coupon Category data" })
// export class CouponCategoryListOutput {

//     @Field(()=>CouponCategories)
//     couponCategoryId: CouponCategories;

//     @Field(()=>[CouponSubCategories], {nullable: true})
//     subCategories?: CouponSubCategories[];
// }


@InputType({ description: "New Coupon sub Category data" })
export class CouponSubCategoryInput {

    @Field()
    name: string;

    @Field(() => GraphQLUpload,{nullable: true})
    image: Upload;

    @Field()
    couponCategoryId: string;
}