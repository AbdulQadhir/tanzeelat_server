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

    @Query(() => Agent)
    async agentDt(
        @Arg("id") id : String
    ): Promise<Agent> {
        const agent = await AgentModel.findById(id);
        return agent;
    }

    @Mutation(() => Agent)
    async addAgent(
        @Arg("input") input: AgentInput
    ): Promise<Agent> {
        const user = new AgentModel({...input});
        const result = await user.save();
        return result;
    }

    @Mutation(() => Agent)
    async updateAgent(
        @Arg("input") input: AgentInput,
        @Arg("id") id: string
    ): Promise<Agent> {
        const result = await AgentModel.findByIdAndUpdate(id,{
            $set:{
                name: input.name,
                password: input.password,
                email:input.email,
                phone:input.phone,
                roles:input.roles,
                accessVendors:input.accessVendors
            }
        });
        return result;
    }
}
