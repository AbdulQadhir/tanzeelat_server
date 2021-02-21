import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType({ description: "New Catalog Category data" })
export class CatalogCategoryInput {

    @Field()
    @Length(3, 100)
    name: string;
}
