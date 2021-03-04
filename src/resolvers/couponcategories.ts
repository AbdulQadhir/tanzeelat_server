import "reflect-metadata";
import { CouponCategoryInput } from "../gqlObjectTypes/couponcategories.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CouponCategoriesModel, {CouponCategories} from "../models/CouponCategories"

 
@Resolver()
export class CouponCatagoriesResolver {
    @Query(() => [CouponCategories])
    async couponCategories(): Promise<CouponCategories[]> {
        const cats = await CouponCategoriesModel.find();
        return cats;
    }

    @Mutation(() => CouponCategories)
    async addCouponCategory(
        @Arg("input") input: CouponCategoryInput
    ): Promise<CouponCategories> {
        const user = new CouponCategoriesModel({...input});
        const result = await user.save();
        return result;
    }
}
