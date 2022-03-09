import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@InputType()
export class LocationInput {
  @Field(() => String, { nullable: true })
  lat: string;

  @Field(() => String, { nullable: true })
  lng: string;
}

@ObjectType()
export class Location {
  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => [Number], { nullable: true })
  coordinates?: number[];
}

@InputType({ description: "New User data" })
export class AddUserInput {
  @Field(() => String)
  @Length(3, 100)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  mobile: string;

  @Field(() => String)
  city: string;

  @Field(() => LocationInput, { nullable: true })
  location: LocationInput;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class FieldError {
  @Field(() => String)
  message?: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  city?: string;
}

@ObjectType()
export class AddUserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => String, { nullable: true })
  userId?: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
