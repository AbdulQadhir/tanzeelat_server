import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose";
import { VendorOutlet } from "./VendorOutlet";
import { Vendor } from "./Vendor";
import { RedeemType, StoreType } from "../enums/coupon.enum";

@ObjectType({ description: "The Coupon model" })
export class Coupon {
  @prop()
  @Field(() => ID)
  id: string;

  @Field()
  _id: string;

  @prop()
  @Field({ nullable: true })
  uuid: string;

  @prop()
  @Field({ nullable: true })
  name: string;

  @prop()
  @Field({ nullable: true })
  namear: string;

  @prop()
  @Field({ nullable: true })
  description: string;

  @prop()
  @Field({ nullable: true })
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
  @Field({ nullable: true })
  terms?: string;

  @prop()
  @Field({ nullable: true })
  termsar?: string;

  @prop()
  @Field(() => Number, { nullable: true })
  redeemLimit?: Number;

  @prop()
  @Field({ nullable: true })
  couponCategoryId?: string;

  @prop()
  @Field({ nullable: true })
  couponSubCategoryId?: string;

  @prop()
  @Field(() => [String])
  outlets: string[];

  @prop()
  @Field(() => [VendorOutlet], { nullable: true })
  outletsDt: VendorOutlet[];

  @prop()
  @Field(() => Vendor, { nullable: true })
  vendor: Vendor;

  @prop()
  @Field({ nullable: true })
  menu?: string;

  @prop()
  @Field({ nullable: true })
  thumbnail?: string;

  @prop()
  @Field({ nullable: true })
  thumbnailAr?: string;

  @prop()
  @Field({ nullable: true })
  userCouponId: string;

  @prop()
  @Field(() => Number, { nullable: true })
  featured: Number;

  @prop()
  @Field({ nullable: true })
  code: string;

  @prop()
  @Field({ nullable: true })
  customDtTitle: String;

  @prop()
  @Field({ nullable: true })
  customDtDescription: String;

  @prop()
  @Field({ nullable: true })
  customDtTitleAr: String;

  @prop()
  @Field({ nullable: true })
  customDtDescriptionAr: String;

  @prop()
  @Field({ nullable: true })
  url: String;

  @prop()
  @Field({ nullable: true })
  storeType: StoreType;

  @prop()
  @Field({ nullable: true })
  redeemType: RedeemType;

  @prop()
  @Field(() => Number, { nullable: true })
  perUserLimit: Number;

  @prop()
  @Field(() => Number, { nullable: true })
  userRedeemed: Number;

  @prop()
  @Field(() => Number, { nullable: true })
  totalRedeemed: Number;
}

const couponSchema = new Schema({
  uuid: String,
  name: String,
  namear: String,
  description: String,
  descriptionar: String,
  terms: String,
  termsar: String,
  startDate: Date,
  endDate: Date,
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  couponCategoryId: { type: Mongoose.Types.ObjectId, ref: "CouponCategories" },
  couponSubCategoryId: {
    type: Mongoose.Types.ObjectId,
    ref: "CouponSubCategories",
  },
  outlets: [{ type: Mongoose.Types.ObjectId, ref: "VendorOutlet" }],
  menu: String,
  thumbnail: String,
  thumbnailAr: String,
  redeemLimit: Number,
  featured: Number,
  limitType: String,
  perUserLimit: Number,

  code: String,
  customDtTitle: String,
  customDtDescription: String,
  customDtTitleAr: String,
  customDtDescriptionAr: String,
  url: String,
  storeType: String,
  redeemType: String,
});

const CouponModel: Model<any> = Mongoose.model("Coupon", couponSchema);

export default CouponModel;
