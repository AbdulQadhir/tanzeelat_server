import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema  } from "mongoose"

@ObjectType({ description: "The Coupon model" })
export class Coupon {
  
  @prop()
  @Field(() => ID)
  id: string;

  @Field()
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  description: string;

  @prop()
  @Field()
  startDate: Date;

  @prop()
  @Field()
  endDate: Date;

  @prop()
  @Field()
  vendorId: string;

  @prop()
  @Field(() => [String])
  outlets: string[];
}

const couponSchema = new Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  outlets: [{ type: Mongoose.Types.ObjectId, ref: "VendorOutlet" }]
});

const CouponModel : Model<any> = Mongoose.model('Coupon', couponSchema);

export default CouponModel;