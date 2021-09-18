import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"
import { User } from "./User";

@ObjectType({ description: "The Help model" })
export class Help {
  
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
  subject: string;

  @prop()
  @Field()
  description: string;

  @prop()
  @Field(()=>[String])
  images: [string];

  @prop()
  @Field(()=>User,{nullable: true})
  user?: User;
}

const helpSchema = new Schema({
  userId: { type: Mongoose.Types.ObjectId, ref: "User" },
  subject: String,
  description: String,
  images: [String]
});

const HelpModel : Model<any> = Mongoose.model('Help', helpSchema);

export default HelpModel;