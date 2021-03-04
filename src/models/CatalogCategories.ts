import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Catalog Category model" })
export class CatalogCategories {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  name: string;
}

const catalogCategorySchema = new Schema({
  name: String,
});

const CatalogCategoriesModel : Model<any> = Mongoose.model('CatalogCategories', catalogCategorySchema);

export default CatalogCategoriesModel;