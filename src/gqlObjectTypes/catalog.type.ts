import { Field, InputType } from "type-graphql";

@InputType({ description: "New Catalog data" })
export class CatalogInput {

    @Field()
    title: string;

    @Field()
    vendorId: string;

    @Field(() => [String])
    outlets: string[];

    @Field({nullable: true})
    pages: number;
}
