import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";
import { LocationInput } from "./user.types";
import { WorkingHoursInput } from "./vendor.types";

@InputType({ description: "New Vendor Outlet data" })
export class VendorOutletInput {

    @Field()
    vendorId: string;

    @Field()
    @Length(3, 100)
    name: string;

    @Field()
    @Length(3, 100)
    namear: string;

    @Field()
    state: string;

    @Field()
    place: string;

    @Field({nullable: true})
    location: LocationInput;
  
    @Field(() => [WorkingHoursInput],{nullable: true})
    workingHours: [WorkingHoursInput];
}
