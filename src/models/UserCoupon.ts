import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose";

@ObjectType({ description: "The User Coupon model" })
export class UserCoupon {
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  userId: string;

  @prop()
  @Field()
  couponId: string;

  @prop()
  @Field({ nullable: true })
  outletId: string;

  @prop()
  @Field({ nullable: true })
  vendorUserId: string;

  @prop()
  @Field(() => Boolean)
  redeemed: Boolean;
}

const userCouponSchema = new Schema(
  {
    userId: { type: Mongoose.Types.ObjectId, ref: "User" },
    couponId: { type: Mongoose.Types.ObjectId, ref: "Coupon" },
    outletId: { type: Mongoose.Types.ObjectId, ref: "VendorOutlet" },
    vendorUserId: { type: Mongoose.Types.ObjectId, ref: "VendorUser" },
    redeemed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserCouponModel: Model<any> = Mongoose.model(
  "UserCoupon",
  userCouponSchema
);

export default UserCouponModel;
