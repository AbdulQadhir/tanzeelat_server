import { Field, InputType } from "type-graphql";


@InputType({ description: "New VendorUser data" })
export class AddVendorUserInput {
  
    @Field()
    username: string;
  
    @Field()
    password: string;
  
    @Field()
    vendorId: string;
  
    @Field(()=>[String])
    outlets: [string];
  
  }