import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Model } from "mongoose"
import { Location } from "../gqlObjectTypes/user.types";
import VendorCategory from "../enums/vendorcategory.enum";

@ObjectType({ description: "The Vendor model" })
export class Vendor {
  
  @prop()
  @Field(() => ID)
  id: string;

  @Field()
  _id: string;

  @prop()
  @Field()
  username: string;

  @prop()
  @Field()
  password: string;

  @prop()
  @Field()
  brandname: string;

  @prop()
  @Field()
  shopname: string;

  @prop()
  @Field()
  category: VendorCategory;

  @prop()
  @Field()
  tradelicense: string;

  @prop()
  @Field()
  emiratesid: string;

  @prop()
  @Field({nullable: true})
  location: Location;

  @prop()
  @Field({nullable: true})
  ownername: string;

  @prop()
  @Field({nullable: true})
  ownerphone: string;

  @prop()
  @Field({nullable: true})
  owneremail: string;

  @prop()
  @Field()
  contactname: string;

  @prop()
  @Field()
  contactphone: string;

  @prop()
  @Field()
  contactmobile: string;

  @prop()
  @Field()
  contactemail: string;
}

const VendorModel : Model<any> = getModelForClass(Vendor); 

export default VendorModel;