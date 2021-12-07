import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema } from "mongoose"

@ObjectType({ description: "The Notification model" })
export class Notification {
  
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
  @Field({nullable: true})
  titlear: string;

  @prop()
  @Field()
  description: string;

  @prop()
  @Field({nullable: true})
  descriptionar: string;

  @prop()
  @Field({nullable: true})
  image: string;

  @prop()
  @Field(()=>[String])
  users: [string];

  @prop()
  @Field({nullable: true})
  createdAt: Date;
  
}

const NotifcationSchema = new Schema({
  title: String,
  titlear: String,
  description: String,
  descriptionar: String,
  image: String,
  users: [{ type: Mongoose.Types.ObjectId, ref: "User" }]
},{timestamps: true});

const NotificationModel : Model<any> = Mongoose.model('Notification', NotifcationSchema);

export default NotificationModel;