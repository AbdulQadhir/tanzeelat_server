import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Log model" })
export class Log {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  userId: string;

  @prop()
  @Field()
  type: string;

  @prop()
  @Field()
  time: string;

  @prop()
  @Field()
  catalogId: string;

  @prop()
  @Field()
  page: number;
  
}

const LogSchema = new Schema({
  userId: { type: Mongoose.Types.ObjectId, ref: "User" },
  type: String,
  time: Date,
  catalogId: { type: Mongoose.Types.ObjectId, ref: "Catalog" },
  page: Number
});

const LogModel : Model<any> = Mongoose.model('Log', LogSchema);

export default LogModel;