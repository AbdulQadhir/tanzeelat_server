import { GraphQLUpload,  } from "graphql-upload";
import { Stream } from "stream";
import { Field, InputType } from "type-graphql";

@InputType({ description: "New Catalog data" })
export class WarrantyCardInput {

    @Field()
    name: string;
  
    @Field()
    brand: string;
  
    @Field()
    model: string;
  
    @Field()
    category: string;
  
    @Field()
    invoiceNo: string;
  
    @Field()
    price: number;
  
    @Field()
    purchaseDate: Date;
  
    @Field()
    warrantyTerm: Date;
  
    @Field()
    store: string;
  
    @Field()
    contact: string;
  
    @Field()
    notes: string;
  
    @Field()
    userId: string;

    @Field(() => GraphQLUpload,{ nullable: true })
    image1: Upload;

    @Field(() => GraphQLUpload,{ nullable: true })
    image2: Upload;

    @Field(() => GraphQLUpload,{ nullable: true })
    image3: Upload;
}

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream
}
