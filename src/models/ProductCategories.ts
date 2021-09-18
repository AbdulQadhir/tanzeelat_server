import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"
import { ProductSubCategories } from "./ProductSubCategory";

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
  namear?: string;

  @prop()
  @Field({nullable: true})
  image: string;

  @prop()
  @Field(()=>[ProductSubCategories],{nullable: true})
  subcategories?: ProductSubCategories[];
}

const productCategorySchema = new Schema({
  name: String,
  namear: String,
  image: String
});

const ProductCategoriesModel : Model<any> = Mongoose.model('ProductCategories', productCategorySchema);

export default ProductCategoriesModel;