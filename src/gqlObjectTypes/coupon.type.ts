import { Field, InputType, ObjectType } from "type-graphql";
import { Upload } from "./catalog.type";
import { GraphQLUpload } from "graphql-upload";
import { Vendor } from "../models/Vendor";
import { Coupon } from "../models/Coupon";
import { VendorOutlet } from "../models/VendorOutlet";

@InputType({ description: "New Coupon data" })
export class CouponInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  namear?: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  descriptionar?: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field()
  vendorId: string;

  @Field()
  couponCategoryId: string;

  @Field({ nullable: true })
  terms: string;

  @Field({ nullable: true })
  termsar: string;

  @Field({ nullable: true })
  couponSubCategoryId?: string;

  @Field(() => [String])
  outlets: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  menu: Upload;

  @Field(() => GraphQLUpload, { nullable: true })
  thumbnail: Upload;

  @Field(() => GraphQLUpload, { nullable: true })
  thumbnailAr: Upload;

  @Field(() => Number, { nullable: true })
  redeemLimit: Number;

  @Field(() => Number, { nullable: true })
  featured: Number;
}

@InputType({ description: "Coupon filter" })
export class CouponFilterInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  search?: string;

  @Field(() => [Number], { nullable: true })
  coordinates?: [Number];

  @Field({ nullable: true })
  sortBy?: string;
}

@ObjectType()
export class CouponUnveil {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  couponId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  namear?: string;

  @Field({ nullable: true })
  coupon?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionar?: string;

  @Field({ nullable: true })
  redeemed?: boolean;

  @Field(() => GraphQLUpload, { nullable: true })
  menu?: Upload;
}

@ObjectType()
export class CouponRedeemDetails {
  @Field({ nullable: true })
  couponId?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  vendorUserId?: string;

  @Field({ nullable: true })
  outletId?: string;

  @Field({ nullable: true })
  state?: string;
}

@ObjectType()
export class CouponRedeemOutput {
  @Field({ nullable: true })
  result?: Boolean;

  @Field({ nullable: true })
  error?: string;

  @Field(() => CouponRedeemDetails, { nullable: true })
  details?: CouponRedeemDetails;
}

@ObjectType()
export class CouponSummary {
  @Field({ nullable: true })
  sent?: number;

  @Field({ nullable: true })
  redeemed?: number;
}

@ObjectType()
export class CouponFilterOutput {
  @Field()
  _id?: string;

  @Field(() => Number, { nullable: true })
  distance?: Number;

  @Field(() => VendorOutlet, { nullable: true })
  outlet?: VendorOutlet;

  @Field(() => Vendor)
  vendor?: Vendor;

  @Field(() => Coupon)
  coupon?: Coupon;
}

@ObjectType()
export class HistoryItem {
  @Field({ nullable: true })
  coupon_name?: string;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  index?: number;
}
