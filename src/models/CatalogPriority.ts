import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose";

@ObjectType({ description: "The Catalog Priority model" })
export class Agent {
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  vendorId: string;

  @prop()
  @Field()
  catalogId: string;

  @prop()
  @Field()
  rank: number;
}

const catalogPrioritySchema = new Schema({
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  catalogId: { type: Mongoose.Types.ObjectId, ref: "Catalog" },
  rank: Number,
});

const CatalogPriorityModel: Model<any> = Mongoose.model(
  "CatalogPriority",
  catalogPrioritySchema
);

export default CatalogPriorityModel;
