import { ProductSubCategories } from "../models/ProductSubCategory";
import { Field, InputType, ObjectType } from "type-graphql";
import { ProductCategories } from "../models/ProductCategories";

@InputType({ description: "New Product Category data" })
export class ProductCategoryInput {

    @Field()
    name: string;

    @Field({nullable: true})
    image?: string;
}

@ObjectType({ description: "Product Category data" })
export class ProductCategoryListOutput {

    @Field(()=>ProductCategories)
    productCategoryId: ProductCategories;

    @Field(()=>[ProductSubCategories], {nullable: true})
    subCategories?: ProductSubCategories[];
}

@InputType({ description: "New Product Sub Category data" })
export class ProductSubCategoryInput {

    @Field()
    name: string;

    @Field()
    productCategoryId: string;
}