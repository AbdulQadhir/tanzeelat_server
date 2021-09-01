import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Otp model" })
export class Otp {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  mobile: string;

  @prop()
  @Field()
  otp: string;
  
}

const OtpSchema = new Schema({
  mobile: String,
  otp: String
});

const OtpModel : Model<any> = Mongoose.model('Otp', OtpSchema);

export default OtpModel;