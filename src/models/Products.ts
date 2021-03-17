import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema  } from "mongoose"

@ObjectType({ description: "The Product model" })
export class Product {
  
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
  productCategoryId: string;

  @prop()
  @Field()
  productSubCategoryId: string;

  @prop()
  @Field({nullable: true})
  image: string;
}

const productSchema = new Schema({
  name: String,
  expiry: Date,
  productCategoryId: { type: Mongoose.Types.ObjectId, ref: "ProductCategories" },
  productSubCategoryId: { type: Mongoose.Types.ObjectId, ref: "ProductSubCategories" },
  image: String
});

const ProductModel : Model<any> = Mongoose.model('Product', productSchema);

export default ProductModel;