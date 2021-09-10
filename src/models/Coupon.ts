import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema  } from "mongoose"
import { VendorOutlet } from "./VendorOutlet";
import { Vendor } from "./Vendor";

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
  namear: string;

  @prop()
  @Field()
  description: string;

  @prop()
  @Field()
  descriptionar: string;

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
  @Field(()=>Number,{nullable: true})
  redeemLimit?: Number;

  @prop()
  @Field()
  couponCategoryId: string;

  @prop()
  @Field()
  couponSubCategoryId: string;

  @prop()
  @Field(() => [String])
  outlets: string[];

  @prop()
  @Field(() => [VendorOutlet],{nullable: true})
  outletsDt: VendorOutlet[];

  @prop()
  @Field(() => Vendor,{nullable: true})
  vendor: Vendor;

  @prop()
  @Field({nullable: true}) 
  menu: string;

  @prop()
  @Field({nullable: true})
  userCouponId: string;
}

const couponSchema = new Schema({
  name: String,
  namear: String,
  description: String,
  descriptionar: String,
  startDate: Date,
  endDate: Date,
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  couponCategoryId: { type: Mongoose.Types.ObjectId, ref: "CouponCategories" },
  couponSubCategoryId: { type: Mongoose.Types.ObjectId, ref: "CouponSubCategories" },
  outlets: [{ type: Mongoose.Types.ObjectId, ref: "VendorOutlet" }],
  menu: String,
  redeemLimit: Number
});

const CouponModel : Model<any> = Mongoose.model('Coupon', couponSchema);

export default CouponModel;