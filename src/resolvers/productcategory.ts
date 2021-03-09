import "reflect-metadata";
import { ProductCategoryInput } from "../gqlObjectTypes/productcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import ProductCategoriesModel, { ProductCategories } from "../models/ProductCategories";

 
@Resolver()
export class ProductCatagoriesResolver {
    @Query(() => [ProductCategories])
    async productCategories(): Promise<ProductCategories[]> {
        const cats = await ProductCategoriesModel.find();
        console.log(cats);
        return cats;
    }

    @Mutation(() => ProductCategories)
    async addProductCategory(
        @Arg("input") input: ProductCategoryInput
    ): Promise<ProductCategories> {
        const user = new ProductCategoriesModel({...input});
        const result = await user.save();
        return result;
    }

    @Mutation(() => Boolean)
    async updProductCategory(
        @Arg("input") input: ProductCategoryInput,
        @Arg("productCategoryId") productCategoryId: String
    ): Promise<Boolean> {
        const result = await ProductCategoriesModel.findByIdAndUpdate(productCategoryId, {
            $set: {
                name: input.name
            }
        })
        return result ? true : false;
    }
}
