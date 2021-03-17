import { GraphQLUpload,  } from "graphql-upload";
import { Stream } from "stream";
import { Field, InputType } from "type-graphql";

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

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream
}

