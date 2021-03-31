import { Field, InputType, ObjectType } from "type-graphql";

@InputType({ description: "Login" })
export class LoginInput {

    @Field()
    email: string;

    @Field()
    password: string;

}

@ObjectType({ description: "Login Output" })
export class LoginOutput {
  
  @Field({nullable: true})
  token?: string;

  @Field(()=>[String], {nullable: true})
  roles?: string[];

  @Field({nullable: true})
  error?: string;
  
}