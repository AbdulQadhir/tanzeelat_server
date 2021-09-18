import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Coupon Category model" })
export class CouponSubCategories {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field({nullable: true})
  namear: string;

  @prop()
  @Field({nullable: true})
  image: string;

  @prop()
  @Field()
  couponCategoryId: string;
}

const couponSubCategorySchema = new Schema({
  name: String,
  namear: String,
  image: String,
  couponCategoryId: { type: Mongoose.Types.ObjectId, ref: "CouponCategories" },
});

const CouponSubCategoriesModel : Model<any> = Mongoose.model('CouponSubCategories', couponSubCategorySchema);

export default CouponSubCategoriesModel; 
