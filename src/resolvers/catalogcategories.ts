import "reflect-metadata";
import { CatalogCategoryInput } from "../gqlObjectTypes/catalogcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CatalogCategoriesModel, {CatalogCategories} from "../models/CatalogCategories"

 
@Resolver()
export class CatalogCatagoriesResolver {
    @Query(() => [CatalogCategories])
    async catalogCategories(): Promise<CatalogCategories[]> {
        const cats = await CatalogCategoriesModel.find();
        console.log(cats);
        return cats;
    }

    @Mutation(() => CatalogCategories)
    async addCatalogCategory(
        @Arg("input") input: CatalogCategoryInput
    ): Promise<CatalogCategories> {
        const user = new CatalogCategoriesModel({...input});
        const result = await user.save();
        return result;
    }
}
