import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"
import { Location } from "../gqlObjectTypes/user.types";

@ObjectType({ description: "The Vendor Outlet model" })
export class VendorOutlet {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop(() => ID)
  @Field()
  vendorId: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  state: string;

  @prop()
  @Field()
  location: Location;
}

const LocationSchema = new Schema({
  lat : String,
  lng : String,
});

const vendorSchema = new Schema({
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  name: String,
  state: String,
  location: LocationSchema
});

const VendorOutletModel : Model<any> = Mongoose.model('VendorOutlet', vendorSchema);

export default VendorOutletModel;
