import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";
import { LocationInput } from "./user.types";

@InputType({ description: "New Vendor Outlet data" })
export class VendorOutletInput {

    @Field()
    vendorId: string;

    @Field()
    @Length(3, 100)
    name: string;

    @Field()
    state: string;

    @Field({nullable: true})
    location: LocationInput;
}
