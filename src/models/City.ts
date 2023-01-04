import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose";

@ObjectType({ description: "The City model" })
export class City {
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  city: string;

  @prop()
  @Field()
  cityAr: string;
}

const citySchema = new Schema({
  city: String,
  cityAr: String,
});

const CityModel: Model<any> = Mongoose.model("City", citySchema);

export default CityModel;
