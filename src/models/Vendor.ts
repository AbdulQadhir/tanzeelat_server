import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"
import { Location } from "../gqlObjectTypes/user.types";
import VendorCategory from "../enums/vendorcategory.enum";

@ObjectType({ description: "The Vendor model" })
export class Vendor {
  
  @prop()
  @Field(() => ID)
  id: string;
  
  @Field(() => ID)
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
  @Field({nullable: true})
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

  @prop()
  @Field({nullable: true})
  logo: string;

  @prop()
  @Field({nullable: true})
  about?: string;

  @prop()
  @Field({nullable: true})
  subTitle: string;

  @prop()
  @Field()
  grade: number;
}

const vendorSchema = new Schema({
  username: String,
  password: String,
  brandname: String,
  shopname: String,
  category: String,
  tradelicense: String,
  emiratesid: String,
  ownername: String,
  ownerphone: String,
  owneremail: String,
  contactname: String,
  contactphone: String,
  contactmobile: String,
  contactemail: String,
  grade: Number,
  active : {type: Boolean, default: true}
});

const VendorModel : Model<any> = Mongoose.model('Vendor', vendorSchema);

export default VendorModel;