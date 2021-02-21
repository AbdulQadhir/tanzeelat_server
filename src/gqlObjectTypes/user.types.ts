import { Gender } from "../enums/user.enum";
import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, Length } from "class-validator";


@InputType()
export class LocationInput {
    @Field({nullable: true} )
    name?: string

    @Field({nullable: true})
    lat?: string

    @Field({nullable: true})
    lng?: string
}

@ObjectType()
export class Location {
    @Field({nullable: true} )
    name?: string

    @Field({nullable: true})
    lat?: string

    @Field({nullable: true})
    lng?: string
}

@InputType({ description: "New User data" })
export class AddUserInput {

    @Field()
    @Length(3, 100)
    name: string;
  
    @Field()
    @IsEmail()
    email: string;
  
    @Field()
    @Length(5, 15)
    mobile: string;
  
    @Field()
    @Length(10, 50)
    emiratesId: string;
  
    @Field({nullable: true})
    location: LocationInput;
  
    @Field({nullable: true})
    gender: Gender;
  
    @Field({nullable: true})
    ageGroup: string;
  
    @Field()
    password: string;
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
    email: string

    @Field()
    password:  string
}

