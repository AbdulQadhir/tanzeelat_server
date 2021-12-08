import "reflect-metadata";
import { CatalogCategoryInput } from "../gqlObjectTypes/catalogcategories.types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql"
import CatalogCategoriesModel, {CatalogCategories} from "../models/CatalogCategories"
import { Context } from "@apollo/client";
import { Roles } from "../enums/roles.enum";

@Resolver()
export class CatalogCatagoriesResolver {
    @Query(() => [CatalogCategories])
    async catalogCategories(): Promise<CatalogCategories[]> {
        const cats = await CatalogCategoriesModel.find();
        return cats;
    }

    @Query(() => CatalogCategories)
    async catalogCategoryDt(
        @Arg("id") id : String
    ): Promise<CatalogCategories> {
        const CatalogCategory = await CatalogCategoriesModel.findById(id);
        return CatalogCategory;
    }

    @Mutation(() => CatalogCategories)
    async addCatalogCategory(
        @Arg("input") input: CatalogCategoryInput,
        @Ctx() ctx: Context
    ): Promise<CatalogCategories> {
        
        if(!ctx.roles?.includes(Roles.SettingsManageRole))
        {}//    throw new Error("Unauthorized!");
            
        const user = new CatalogCategoriesModel({...input});
        const result = await user.save();
        return result;
    }

    @Mutation(() => CatalogCategories)
    async updCatalogCategory(
        @Arg("input") input: CatalogCategoryInput,
        @Arg("id") id: String
    ): Promise<CatalogCategories> {
        const result = await CatalogCategoriesModel.findByIdAndUpdate(id, {
            $set: {
                name: input.name,
                namear: input.namear
            }
        })
        return result;
    }
}
