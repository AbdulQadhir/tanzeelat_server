import { GraphQLUpload,  } from "graphql-upload";
import { Stream } from "stream";
import { Field, InputType } from "type-graphql";

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream
}

@InputType()
export class HelpInput {

    @Field(() => String,{ nullable: true })
    token: string;

    @Field(() => [GraphQLUpload],{ nullable: true })
    images: [Upload];

    @Field(() => String,{ nullable: true })
    subject: string;

    @Field(() => String,{ nullable: true })
    description: string;
    
}

@InputType()
export class HelpInput1 {

    @Field(() => String,{ nullable: true })
    token: string;

    @Field(() => String,{ nullable: true })
    subject: string;

    @Field(() => String,{ nullable: true })
    description: string;
    
}
