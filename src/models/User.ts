import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Model } from "mongoose"

@ObjectType({ description: "The User model" })
export class User {
  
  @prop()
  @Field(() => ID)
  id: string;

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
  mobile: string;

  @prop()
  @Field()
  city: string;

  @prop()
  @Field()
  password: string;

  @prop()
  @Field()
  verified: boolean;
}

const UserModel : Model<any> = getModelForClass(User); 

export default UserModel;