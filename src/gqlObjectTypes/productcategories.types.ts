import { ProductSubCategories } from "../models/ProductSubCategory";
import { Field, InputType, ObjectType } from "type-graphql";
import { ProductCategories } from "../models/ProductCategories";
import { GraphQLUpload } from "graphql-upload";
import { Upload } from "./catalog.type";

@InputType({ description: "New Product Category data" })
export class ProductCategoryInput {

    @Field()
    name: string;

    @Field()
    namear: string;

    @Field(() => GraphQLUpload,{nullable: true})
    image: Upload;
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
    namear: string;

    @Field(() => GraphQLUpload,{nullable: true})
    image: Upload;

    @Field()
    productCategoryId: string;
}