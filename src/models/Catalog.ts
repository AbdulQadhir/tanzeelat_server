import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema  } from "mongoose"

@ObjectType({ description: "The Catalog model" })
export class Catalog {
  
  @prop()
  @Field(() => ID)
  id: string;

  @Field()
  _id: string;

  @prop()
  @Field()
  title: string;

  @prop()
  @Field()
  vendorId: string;

  @prop()
  @Field(() => [String])
  outlets: string[];

  @prop()
  @Field({nullable: true})
  pages: number;
}

const catalogSchema = new Schema({
  title: String,
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  outlets: [{ type: Mongoose.Types.ObjectId, ref: "VendorOutlet" }],
  pages: Number,
});

const CatalogModel : Model<any> = Mongoose.model('Catalog', catalogSchema);

export default CatalogModel;