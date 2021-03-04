import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType({ description: "New Coupon Category data" })
export class CouponCategoryInput {

    @Field()
    @Length(3, 100)
    name: string;

    @Field({nullable: true})
    image: string;

    @Field({nullable: true})
    logo: string;
}
