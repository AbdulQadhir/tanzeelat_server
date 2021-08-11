import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Product Sub Category model" })
export class ProductSubCategories {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field({nullable: true})
  name?: string;

  @prop()
  @Field({nullable: true})
  image: string;

  @prop()
  @Field()
  productCategoryId: string;
  
}

const productSubCategorySchema = new Schema({
  name: String,
  image: String,
  productCategoryId: { type: Mongoose.Types.ObjectId, ref: "ProductCategories" },
});

const ProductSubCategoriesModel : Model<any> = Mongoose.model('ProductSubCategories', productSubCategorySchema);

export default ProductSubCategoriesModel;