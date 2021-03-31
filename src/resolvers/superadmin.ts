import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import SuperAdminModel, { SuperAdmin } from "../models/SuperAdmin";
import { SuperAdminInput } from "../gqlObjectTypes/superadmin.types";

@Resolver()
export class SuperAdminResolver {
    @Query(() => [SuperAdmin])
    async superadmins(): Promise<SuperAdmin[]> {
        const cats = await SuperAdminModel.find();
        console.log(cats);
        return cats;
    }

    @Mutation(() => SuperAdmin)
    async addSuperAdmin(
        @Arg("input") input: SuperAdminInput
    ): Promise<SuperAdmin> {
        const user = new SuperAdminModel({...input});
        const result = await user.save();
        return result;
    }
}
