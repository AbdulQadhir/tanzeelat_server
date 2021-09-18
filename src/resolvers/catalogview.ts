import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CatalogViewModel from "../models/CatalogView";
import { CatalogViewInput } from "../gqlObjectTypes/catalogview.types";
 
@Resolver()
export class CatalogViewResolver {
    @Query(() => Number)
    async catalogViews(
        @Arg("id") id: String
    ): Promise<number> {
        const cats = await CatalogViewModel.count({catalogId:id});
        return cats || 0;
    }

    @Mutation(() => Boolean)
    async addCatalogView(
        @Arg("input") input: CatalogViewInput
    ): Promise<Boolean> {
        const result = await CatalogViewModel.findOneAndUpdate({...input},{},{upsert: true}); //Insert if not exists
        return result ? false : true;
    }
}
