import "reflect-metadata";
import { ProductSubCategoryInput} from "../gqlObjectTypes/productcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import ProductSubCategoriesModel, { ProductSubCategories } from "../models/ProductSubCategory";
 
@Resolver()
export class ProductSubCatagoriesResolver {
    @Query(() => [ProductSubCategories])
    async productSubCategories(): Promise<ProductSubCategories[]> {
        const cats = await ProductSubCategoriesModel.find();
        console.log(cats);
        return cats;
    }

    @Mutation(() => ProductSubCategories)
    async addProductSubCategory(
        @Arg("input") input: ProductSubCategoryInput
    ): Promise<ProductSubCategories> {
        const user = new ProductSubCategoriesModel({...input});
        const result = await user.save();
        return result;
    }
}
