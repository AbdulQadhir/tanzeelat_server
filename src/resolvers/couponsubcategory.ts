import "reflect-metadata";
import { CouponSubCategoryInput } from "../gqlObjectTypes/couponcategories.types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import CouponSubCategoriesModel, {
  CouponSubCategories,
} from "../models/CouponSubCategories";
import { v4 as uuidv4 } from "uuid";
import { AZURE_CONTAINER } from "../constants/azure";
import { azureUpload, deleteFile } from "../utils/azure";
import { Context } from "@apollo/client";

const path = require("path");

@Resolver()
export class CouponSubCatagoriesResolver {
  @Query(() => [CouponSubCategories])
  async couponSubCategories(
    @Arg("id") id: string
  ): Promise<CouponSubCategories[]> {
    const cats = await CouponSubCategoriesModel.find({ couponCategoryId: id });
    return cats;
  }

  @Mutation(() => CouponSubCategories)
  async addCouponSubCategory(
    @Arg("input") input: CouponSubCategoryInput,
    @Ctx() ctx: Context
  ): Promise<CouponSubCategories> {
    console.log(input);

    let image: any = null;

    if (input.image) {
      const { createReadStream, filename } = await input?.image;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.MISC
      );
      image = Location;
    }

    const item = new CouponSubCategoriesModel({
      name: input.name,
      namear: input.namear,
      couponCategoryId: input.couponCategoryId,
      image,
    });

    const result = await item.save();
    console.log(item);
    return result;
  }

  @Mutation(() => CouponSubCategories)
  async updCouponSubCategory(
    @Arg("input") input: CouponSubCategoryInput,
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<CouponSubCategories> {
    let replace: any = {};
    replace = {
      $set: {
        name: input.name,
        namear: input.namear,
        couponCategoryId: input.couponCategoryId,
      },
    };
    if (input.image) {
      const user = await CouponSubCategoriesModel.findById(id);

      const { createReadStream, filename } = await input?.image;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.MISC
      );

      if (user.image) deleteFile(AZURE_CONTAINER.MISC, user.image);

      replace.$set["image"] = Location;
    }
    const result = await CouponSubCategoriesModel.findByIdAndUpdate(
      id,
      replace
    );
    return result;
  }

  @Query(() => CouponSubCategories)
  async couponSubCategoryDt(
    @Arg("id") id: String
  ): Promise<CouponSubCategories> {
    const CouponSubCategory = await CouponSubCategoriesModel.findById(id);
    return CouponSubCategory;
  }
}
