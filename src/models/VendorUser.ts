import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"
import { VendorOutlet } from "./VendorOutlet";

@ObjectType({ description: "The Vendor User model" })
export class VendorUser {
  
  @prop()
  @Field(() => ID)
  id: string;
  
  @prop()
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
  vendorId: string;

  @prop()
  @Field(()=>[String])
  outlets: [string];

  @prop()
  @Field(()=>[VendorOutlet], {nullable: true})
  outletsDt?: [VendorOutlet];

}

const vendorUserSchema = new Schema({
  username: String,
  password: String,
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  outlets: [{ type: Mongoose.Types.ObjectId, ref: "VendorOutlet" }]
},{timestamps: true});

const VendorUserModel : Model<any> = Mongoose.model('VendorUser', vendorUserSchema);

export default VendorUserModel;