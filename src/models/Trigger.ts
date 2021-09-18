import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Trigger model" })
export class Trigger {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  refId: string;

  @prop()
  @Field()
  action: string;

  @prop()
  @Field()
  user: string;
  
}

const triggerSchema = new Schema({
  refId: Mongoose.Types.ObjectId,
  action: String,
  user: Mongoose.Types.ObjectId
});

const TriggerModel : Model<any> = Mongoose.model('Trigger', triggerSchema);

export default TriggerModel;