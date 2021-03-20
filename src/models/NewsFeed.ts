import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The News Feed model" })
export class NewsFeed {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  title: string;

  @prop()
  @Field()
  description: string;

  @prop()
  @Field({nullable: true})
  createdAt?: Date;

}

const newsFeedSchema = new Schema({
  title: String,
  description: String
},{timestamps: true});

const NewsFeedModel : Model<any> = Mongoose.model('NewsFeed', newsFeedSchema);

export default NewsFeedModel; 
