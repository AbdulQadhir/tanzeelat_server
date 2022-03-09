import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Model } from "mongoose";

@ObjectType({ description: "The User model" })
export class User {
  @prop()
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  _id: string;

  @prop()
  @Field(() => String)
  name: string;

  @prop()
  @Field(() => String, { nullable: true })
  email: string;

  @prop()
  @Field(() => String)
  mobile: string;

  @prop()
  @Field(() => String, { nullable: true })
  city: string;

  @prop()
  @Field(() => String, { nullable: true })
  password: string;

  @prop()
  @Field(() => String, { nullable: true })
  verified: boolean;

  @prop()
  @Field(() => String, { nullable: true })
  playerId: string;
}

const UserModel: Model<any> = getModelForClass(User);

export default UserModel;
