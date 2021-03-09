import { Field, InputType } from "type-graphql";

@InputType({ description: "New Product Category data" })
export class ProductCategoryInput {

    @Field()
    name: string;

    @Field({nullable: true})
    image?: string;
}


@InputType({ description: "New Product Sub Category data" })
export class ProductSubCategoryInput {

    @Field()
    name: string;

    @Field()
    productCategoryId: string;
}