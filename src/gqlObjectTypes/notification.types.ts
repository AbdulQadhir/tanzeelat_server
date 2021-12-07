import { GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";
import { Upload } from "./catalog.type";

@InputType({ description: "New Notification" })
export class NotificationInput {

    @Field()
    title: string;
  
    @Field()
    titlear: string;
  
    @Field()
    description: string;
  
    @Field()
    descriptionar: string;

    @Field(() => GraphQLUpload,{ nullable: true })
    image: Upload;
}
