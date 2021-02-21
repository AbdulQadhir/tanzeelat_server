import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { LocationInput } from "./user.types";


@InputType({ description: "New Vendor data" })
export class AddVendorInput {
  
    @Field()
    @Length(5, 100)
    username: string;
  
    @Field()
    password: string;
  
    @Field()
    brandname: string;
  
    @Field()
    shopname: string;
  
    @Field()
    category: string;
  
    @Field()
    tradelicense: string;
  
    @Field()
    @Length(10, 50)
    emiratesid: string;
  
    @Field({nullable: true})
    location: LocationInput;
  
    @Field({nullable: true})
    @Length(10, 100)
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
  }

@ObjectType()
export class FieldError {
    @Field()
    message?: string
}

@ObjectType()
export class LoginResponse {
    @Field(() => [FieldError], {nullable: true} )
    errors?: FieldError[]

    @Field({nullable: true})
    token?: string
}

@InputType()
export class LoginInput {
    @Field()
    username: string

    @Field()
    password:  string
}

