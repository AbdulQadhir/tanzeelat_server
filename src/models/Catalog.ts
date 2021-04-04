import { prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import Mongoose, { Model, Schema  } from "mongoose"
import { VendorOutlet } from "./VendorOutlet";
import { CatalogStatus } from "../enums/catalogstatus.enum";

@ObjectType({ description: "The Catalog model" })
export class Catalog {
  
  @prop()
  @Field(() => ID)
  id: string;

  @Field()
  _id: string;

  @prop()
  @Field()
  title: string;

  @prop()
  @Field()
  startDate: Date;

  @prop()
  @Field()
  expiry: Date;

  @prop()
  @Field()
  vendorId: string;

  @prop()
  @Field()
  status: string;

  @prop()
  @Field()
  catalogCategoryId: string;

  @prop()
  @Field(() => [VendorOutlet])
  outlets: VendorOutlet[];

  @prop()
  @Field(() => [String],{nullable: true})
  pages: string[];
}

const catalogSchema = new Schema({
  title: String,
  startDate: Date,
  expiry: Date,
  status: { type: String, default: CatalogStatus.PENDING },
  vendorId: { type: Mongoose.Types.ObjectId, ref: "Vendor" },
  catalogCategoryId: { type: Mongoose.Types.ObjectId, ref: "CatalogCategories" },
  outlets: [{ type: Mongoose.Types.ObjectId, ref: "VendorOutlet" }],
  pages: [String],
});

const CatalogModel : Model<any> = Mongoose.model('Catalog', catalogSchema);

export default CatalogModel;