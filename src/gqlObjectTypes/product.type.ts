import { GraphQLUpload,  } from "graphql-upload";
import { Product } from "../models/Products";
import { Stream } from "stream";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType({ description: "New Product data" })
export class ProductInput {

    @Field()
    name: string;

    @Field()
    vendorId: string;

    @Field()
    productCategoryId: string;

    @Field()
    productSubCategoryId: string;

    @Field(() => GraphQLUpload,{ nullable: true })
    image: Upload;
}

@ObjectType()
export class ProductListResponse {

    @Field()
    subcategoryId: string

    @Field()
    subcategory: string

    @Field(() => [Product])
    products: Product[]
}

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream
}

