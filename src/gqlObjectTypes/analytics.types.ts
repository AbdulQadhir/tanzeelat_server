import { Field, ObjectType } from "type-graphql";

// @InputType({ description: "Logs" })
// export class LogInput {

//   @Field()
//   type: string;

//   @Field(()=>[CatalogLog])
//   logs: [CatalogLog];

// }

@ObjectType({ description: "Catalog Logs" })
export class CatalogViewAnalyticsOutput {
  @Field(() => [Number], { nullable: true })
  unique: Number[];

  @Field(() => [Number], { nullable: true })
  views: Number[];

  @Field(() => [Number], { nullable: true })
  clicks: Number[];
}

@ObjectType({ description: "Catalog Logs" })
export class CatalogViewPlaceAnalyticsOutput {
  @Field(() => [String], { nullable: true })
  location: string[];

  @Field(() => [Number], { nullable: true })
  count: Number[];
}
