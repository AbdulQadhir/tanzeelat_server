import { Field, InputType } from "type-graphql";

@InputType({ description: "New News Feed data" })
export class NewsFeedInput {

    @Field()
    title: string;

    @Field()
    description: string;
}
