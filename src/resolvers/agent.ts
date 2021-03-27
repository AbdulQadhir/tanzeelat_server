import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import AgentModel, { Agent } from "../models/Agent";
import { AgentInput } from "../gqlObjectTypes/agent.types";

 
@Resolver()
export class AgentResolver {
    @Query(() => [Agent])
    async agents(): Promise<Agent[]> {
        const cats = await AgentModel.find();
        console.log(cats);
        return cats;
    }

    @Mutation(() => Agent)
    async addAgent(
        @Arg("input") input: AgentInput
    ): Promise<Agent> {
        const user = new AgentModel({...input});
        const result = await user.save();
        return result;
    }
}
