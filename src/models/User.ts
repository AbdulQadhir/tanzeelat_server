import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Model } from "mongoose"
import { Gender } from "../enums/user.enum";
import { Location } from "../gqlObjectTypes/user.types";

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
  emiratesId: string;

  @prop()
  @Field({nullable: true})
  location: Location;

  @prop()
  @Field({nullable: true})
  gender: Gender;

  @prop()
  @Field({nullable: true})
  ageGroup: string;

  @prop()
  @Field()
  password: string;
}

const UserModel : Model<any> = getModelForClass(User); 

export default UserModel;