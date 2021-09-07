import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"
import { Location } from "../gqlObjectTypes/user.types";
import { WorkingHours } from "../gqlObjectTypes/vendor.types";

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
  namear: string;

  @prop()
  @Field()
  state: string;

  @prop()
  @Field({nullable: true})
  place?: string;

  @Field({nullable: true})
  distance: string;

  @prop()
  @Field({nullable: true})
  location: Location;

  @prop()
  @Field(()=>[WorkingHours],{nullable: true})
  workingHours?: WorkingHours[];
}

const LocationSchema = new Schema({
  type: String,
  coordinates: [Number]
});

const WorkingHoursSchema = new Schema({
  active: Boolean,
  from: String,
  to: String
});

const vendorSchema = new Schema({
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  name: String,
  namear: String,
  place: String,
  state: String,
  workingHours: [WorkingHoursSchema],
  location: LocationSchema
});

const VendorOutletModel : Model<any> = Mongoose.model('VendorOutlet', vendorSchema);

export default VendorOutletModel;
