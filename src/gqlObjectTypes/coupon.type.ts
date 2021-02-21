import { Field, InputType } from "type-graphql";

@InputType({ description: "New Coupon data" })
export class CouponInput {

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;

    @Field()
    vendorId: string;

    @Field(() => [String])
    outlets: string[];
}


