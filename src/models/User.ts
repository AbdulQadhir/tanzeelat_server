import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Model } from "mongoose"

@ObjectType({ description: "The User model" })
export class User {
  
  @prop()
  @Field(() => ID)
  id: string;

  @Field({nullable: true})
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field({nullable: true})
  email: string;

  @prop()
  @Field()
  mobile: string;

  @prop()
  @Field({nullable: true})
  city: string;

  @prop()
  @Field({nullable: true})
  password: string;

  @prop()
  @Field({nullable: true})
  verified: boolean;
}

const UserModel : Model<any> = getModelForClass(User); 

export default UserModel;