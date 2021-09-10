import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Coupon Category model" })
export class CouponCategories {
  
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
  @Field()
  namear: string;

  @prop()
  @Field({nullable: true})
  image: string;
}

const couponCategorySchema = new Schema({
  name: String,
  namear: String,
  logo: String,
  image: String
});

const CouponCategoriesModel : Model<any> = Mongoose.model('CouponCategories', couponCategorySchema);

export default CouponCategoriesModel; 
