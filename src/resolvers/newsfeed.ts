import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import NewsFeedModel, { NewsFeed } from "../models/NewsFeed";
import { NewsFeedInput } from "..//gqlObjectTypes/newsfeed.types";

 
@Resolver()
export class NewsFeedResolver {
    @Query(() => [NewsFeed])
    async newsfeeds(): Promise<NewsFeed[]> {
        const news = await NewsFeedModel.find().sort({_id:-1});
        return news;
    }

    @Mutation(() => NewsFeed)
    async addNewsFeed(
        @Arg("input") input: NewsFeedInput
    ): Promise<NewsFeed> {
        const user = new NewsFeedModel({...input});
        const result = await user.save();
        return result;
    }
}
