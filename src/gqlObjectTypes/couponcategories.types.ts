import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";
import { Upload } from "./catalog.type";
import { GraphQLUpload } from "graphql-upload";

@InputType({ description: "New Coupon Category data" })
export class CouponCategoryInput {

    @Field()
    @Length(3, 100)
    name: string;

    @Field(() => GraphQLUpload,{nullable: true})
    image: Upload;

    @Field({nullable: true})
    logo: string;
}
