import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Model } from "mongoose"

@ObjectType({ description: "The Catalog Catagory model" })
export class CatalogCatagories {
  
  @prop()
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  _id: string;

  @prop()
  @Field()
  name: string;
}

const CatalogCatagoriesModel : Model<any> = getModelForClass(CatalogCatagories); 

export default CatalogCatagoriesModel;