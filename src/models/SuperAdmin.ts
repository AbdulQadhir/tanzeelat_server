import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Super admin model" })
export class SuperAdmin {
  
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

const superAdminSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  roles: [String],
});

const SuperAdminModel : Model<any> = Mongoose.model('SuperAdmin', superAdminSchema);

export default SuperAdminModel;