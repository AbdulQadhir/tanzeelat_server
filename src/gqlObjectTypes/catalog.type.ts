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

    @Field()
    startDate: string;

    @Field()
    expiry: string;

    @Field()
    catalogCategoryId: string;

    @Field(() => [String])
    outlets: string[];

    @Field(() => [String],{nullable: true})
    pages: string[];
}
@ObjectType({ description: "The Catalog Output" })
export class CatalogOutput {
  
  @Field()
  _id: string;

  @Field()
  title: string;

  @Field()
  startDate: Date;

  @Field()
  expiry: Date;

  @Field()
  status: String;

  @Field(() => Vendor)
  vendorId: Vendor;

  @Field(() => Vendor,{nullable: true})
  vendor: Vendor;

  @Field()
  catalogCategoryId: string;

  @Field(() => [VendorOutlet])
  outlets: VendorOutlet[];

  @Field(() => VendorOutlet,{nullable: true})
  outlet: VendorOutlet;

  @Field(() => [String],{nullable: true})
  pages: string[];

  @Field(() => [Number],{nullable: true})
  distance?: Number[];

}

@ObjectType({ description: "The Catalog Output" })
export class ActiveCatalogOutput {
  
  @Field()
  _id: string;
  
  @Field()
  state: string;

  @Field(()=>[ActiveCatalogOutputItem])
  catalogs: ActiveCatalogOutputItem[]
}

@ObjectType({ description: "The Catalog Output" })
export class ActiveCatalogOutputItem {
  
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  outletName: string

  @Field()
  vendor: Vendor

  @Field(() => [String],{nullable: true})
  pages: string[];

  @Field(() => [VendorOutlet])
  outlets: VendorOutlet[];

  @Field(() => VendorOutlet)
  outlet: VendorOutlet;

  @Field()
  expiry: Date;

}

@InputType({ description: "Catalog Filters" })
export class CatalogFilters {

    @Field(()=>[String],{nullable: true})
    vendorId?: [string];

    @Field({nullable: true})
    search?: string;

    @Field({nullable: true})
    category?: string;

    @Field({nullable: true})
    state?: string;
    
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
