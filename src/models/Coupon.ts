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
  @Field(({nullable: true}))
  name: string;

  @prop()
  @Field(({nullable: true}))
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
  @Field({nullable: true})
  terms?: string;

  @prop()
  @Field(()=>Number,{nullable: true})
  redeemLimit?: Number;

  @prop()
  @Field({nullable: true})
  couponCategoryId?: string;

  @prop()
  @Field({nullable: true})
  couponSubCategoryId?: string;

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
  menu?: string;

  @prop()
  @Field({nullable: true}) 
  thumbnail?: string;

  @prop()
  @Field({nullable: true})
  userCouponId: string;

  @prop()
  @Field(()=>Number,{nullable: true})
  featured: Number;

  @prop()
  @Field({nullable: true})
  code: string;
}

const couponSchema = new Schema({
  name: String,
  namear: String,
  description: String,
  descriptionar: String,
  terms: String,
  startDate: Date,
  endDate: Date,
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  couponCategoryId: { type: Mongoose.Types.ObjectId, ref: "CouponCategories" },
  couponSubCategoryId: { type: Mongoose.Types.ObjectId, ref: "CouponSubCategories" },
  outlets: [{ type: Mongoose.Types.ObjectId, ref: "VendorOutlet" }],
  menu: String,
  thumbnail: String,
  redeemLimit: Number,
  featured: Number,
  code: String
});

const CouponModel : Model<any> = Mongoose.model('Coupon', couponSchema);

export default CouponModel;