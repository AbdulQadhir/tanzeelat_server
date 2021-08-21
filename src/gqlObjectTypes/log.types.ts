import { Field, InputType } from "type-graphql";

@InputType({ description: "Logs" })
export class LogInput {

  @Field()
  type: string;

  @Field(()=>[CatalogLog])
  logs: [CatalogLog];

}

@InputType({ description: "Catalog Logs" })
export class CatalogLog {

  @Field()
  time: string;

  @Field()
  catalogId: string;

  @Field()
  page: number;

}