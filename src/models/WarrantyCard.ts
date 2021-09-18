import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema  } from "mongoose"

@ObjectType({ description: "The Warranty Card model" })
export class WarrantyCard {
  
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
  brand: string;

  @prop()
  @Field()
  model: string;

  @prop()
  @Field()
  category: string;

  @prop()
  @Field()
  invoiceNo: string;

  @prop()
  @Field()
  price: number;

  @prop()
  @Field()
  purchaseDate: Date;

  @prop()
  @Field()
  warrantyTerm: Date;

  @prop()
  @Field()
  store: string;

  @prop()
  @Field()
  contact: string;

  @prop()
  @Field()
  notes: string;

  @prop()
  @Field()
  userId: string;

  @prop()
  @Field({nullable:true})
  image1: string;

  @prop()
  @Field({nullable:true})
  image2: string;

  @prop()
  @Field({nullable:true})
  image3: string;
}

const WarrantyCardSchema = new Schema({
  name: String,
  brand: String,
  model: String,
  category: String,
  invoiceNo: String,
  price: Number,
  purchaseDate: Date,
  warrantyTerm: Date,
  store: String,
  contact: String,
  notes: String,
  image1: String,
  image2: String,
  image3: String,
  userId: { type: Mongoose.Types.ObjectId, ref: "User" },
});

const WarrantyCardModel : Model<any> = Mongoose.model('WarrantyCard', WarrantyCardSchema);

export default WarrantyCardModel;