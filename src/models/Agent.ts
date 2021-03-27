import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Agent model" })
export class Agent {
  
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
  @Field()
  email: string;

  @prop()
  @Field()
  phone: string;

  @prop()
  @Field()
  password: string;

  @prop()
  @Field(()=>[String],{nullable:true})
  roles: string[];
}

const agentSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  roles: [String],
});

const AgentModel : Model<any> = Mongoose.model('Agent', agentSchema);

export default AgentModel;