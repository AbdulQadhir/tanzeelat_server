import "reflect-metadata";
import { CatalogCategoryInput } from "../gqlObjectTypes/catalogcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CatalogCatagoriesModel, {CatalogCatagories} from "../models/CatalogCategories"

 
@Resolver()
export class CatalogCatagoriesResolver {
    @Query(() => [CatalogCatagories])
    async categories(): Promise<CatalogCatagories[]> {
        return CatalogCatagoriesModel.find();
    }

    @Mutation(() => CatalogCatagories)
    async addCatalogCategory(
        @Arg("input") input: CatalogCategoryInput
    ): Promise<CatalogCatagories> {
        const user = new CatalogCatagoriesModel({...input});
        const result = await user.save();
        return result;
    }
}
