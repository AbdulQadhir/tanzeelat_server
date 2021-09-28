import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail } from "class-validator";
import { LocationInput } from "./user.types";
import { GraphQLUpload } from "graphql-upload";
import { Upload } from "./catalog.type";


@InputType({ description: "New Vendor data" })
export class AddVendorInput {

    @Field()
    namear: string;
  
    @Field()
    brandname: string;
  
    @Field()
    shopname: string;
  
    @Field()
    tradelicense: string;
  
    @Field({nullable: true})
    category?: string;
  
    @Field({nullable: true})
    location: LocationInput;
  
    @Field({nullable: true})
    ownername: string;
  
    @Field({nullable: true})
    ownerphone: string;
  
    @Field({nullable: true})
    @IsEmail()
    owneremail: string;
  
    @Field()
    contactname: string;
  
    @Field()
    contactphone: string;
  
    @Field()
    contactmobile: string;
  
    @Field()
    @IsEmail()
    contactemail: string;

    @Field(() => GraphQLUpload,{ nullable: true })
    logo: Upload;
  
    @Field()
    grade: string;
  
    @Field({ nullable: true })
    about?: string;
  
    @Field({ nullable: true })
    subtitle?: string;
  }

@InputType()
export class WorkingHoursInput {

    @Field({nullable: true})
    active: boolean

    @Field({nullable: true})
    from: string

    @Field({nullable: true})
    to: string
}

@ObjectType()
export class WorkingHours {

    @Field({nullable: true})
    active: boolean

    @Field({nullable: true})
    from: string

    @Field({nullable: true})
    to: string
}


@ObjectType()
export class VendorFieldError {
    @Field()
    message?: string
}

@ObjectType()
export class VendorLoginResponse {
    @Field(() => [VendorFieldError], {nullable: true} )
    errors?: VendorFieldError[]

    @Field({nullable: true})
    name?: string


    @Field({nullable: true})
    token?: string
}

@InputType()
export class VendorLoginInput {
    @Field()
    username: string

    @Field()
    namear: string

    @Field()
    password:  string
}

@ObjectType()
export class VendorExtra {
    @Field({nullable: true})
    catalogs?: number

    @Field({nullable: true})
    coupons?: number

    @Field({nullable: true})
    outlets?: number
}
