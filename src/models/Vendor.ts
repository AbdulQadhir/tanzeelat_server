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
  @Field({nullable: true})
  namear?: string;

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
  subtitle: string;

  @prop()
  @Field()
  grade: number;

  @prop()
  @Field({nullable: true})
  shopimage: string;
}

const vendorSchema = new Schema({
  namear:String,
  brandname: String,
  shopname: String,
  category: String,
  tradelicense: String,
  ownername: String,
  ownerphone: String,
  owneremail: String,
  contactname: String,
  contactphone: String,
  contactmobile: String,
  contactemail: String,
  logo: String,
  grade: Number,
  about: String,
  subtitle: String,
  shopimage: String,
  active : {type: Boolean, default: true}
});

const VendorModel : Model<any> = Mongoose.model('Vendor', vendorSchema);

export default VendorModel;