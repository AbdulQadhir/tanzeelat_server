import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Product Category model" })
export class ProductCategories {
  
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
  image: string;
}

const productCategorySchema = new Schema({
  name: String,
  image: String
});

const ProductCategoriesModel : Model<any> = Mongoose.model('ProductCategories', productCategorySchema);

export default ProductCategoriesModel;