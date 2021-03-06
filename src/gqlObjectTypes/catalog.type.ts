import { GraphQLUpload,  } from "graphql-upload";
import { Vendor } from "../models/Vendor";
import { VendorOutlet } from "../models/VendorOutlet";
import { Stream } from "stream";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType({ description: "New Catalog data" })
export class CatalogInput {

    @Field()
    title: string;

    @Field()
    vendorId: string;

    @Field(() => [String])
    outlets: string[];

    @Field(() => [String],{nullable: true})
    pages: string[];
}
@ObjectType({ description: "The Catalog Output" })
export class CatalogOutput {
  
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  expiry: Date;

  @Field(() => Vendor)
  vendorId: Vendor;

  @Field()
  catalogCategoryId: string;

  @Field(() => [VendorOutlet])
  outlets: VendorOutlet[];

  @Field(() => [String],{nullable: true})
  pages: string[];
}

@InputType({ description: "Catalog Filters" })
export class CatalogFilters {

    @Field({nullable: true})
    vendorId?: string;

    @Field({nullable: true})
    search?: string;

    @Field({nullable: true})
    category?: string;
    
}

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream
}

@ObjectType()
export class UploadRespType {

    @Field()
    result: boolean;
}

@InputType()
export class UpdPagesInput {

    @Field(() => [PageInput],{ nullable: true })
    files: PageInput[];
    
    @Field()
    catalogId: string;
}

@InputType()
export class PageInput {

    @Field(() => GraphQLUpload,{ nullable: true })
    newImg: Upload;

    @Field(() => String,{ nullable: true })
    oldImg: string;
    
}
