import { Field, InputType } from "type-graphql";

@InputType({ description: "New Catalog View data" })
export class CatalogViewInput {

    @Field()
    catalogId: string;

    @Field()
    deviceId: string;
}
