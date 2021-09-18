import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Catalog View Count model" })
export class CatalogView {
  
  @prop()
  @Field(() => ID)
  id: string;
  
  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  catalogId: string;

  @prop()
  @Field()
  deviceId: string;
}

const catalogViewSchema = new Schema({
  catalogId: { type: Mongoose.Types.ObjectId, ref: "Catalog" },
  deviceId: String,
});

const CatalogViewModel : Model<any> = Mongoose.model('CatalogView', catalogViewSchema);

export default CatalogViewModel;