import "reflect-metadata";
import { CouponCategoryInput } from "../gqlObjectTypes/couponcategories.types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import CouponCategoriesModel, {
  CouponCategories,
} from "../models/CouponCategories";

const path = require("path");

import { v4 as uuidv4 } from "uuid";
import { Context } from "@apollo/client";
import { azureUpload, deleteFile } from "../utils/azure";
import { AZURE_CONTAINER } from "../constants/azure";

@Resolver()
export class CouponCatagoriesResolver {
  @Query(() => [CouponCategories])
  async couponCategories(): Promise<CouponCategories[]> {
    const cats = await CouponCategoriesModel.find();
    return cats;
  }

  @Mutation(() => CouponCategories)
  async addCouponCategory(
    @Arg("input") input: CouponCategoryInput,
    @Ctx() ctx: Context
  ): Promise<CouponCategories> {
    let image: any = null;
    console.log(input);
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

      console.log(Location);
      image = Location || "";
    }
    const user = new CouponCategoriesModel({
      name: input.name,
      namear: input.namear,
      image: image || "",
    });
    const result = await user.save();
    return result;
  }

  @Mutation(() => CouponCategories)
  async updCouponCategory(
    @Arg("input") input: CouponCategoryInput,
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<CouponCategories> {
    let replace: any = {};
    replace = {
      $set: {
        name: input.name,
        namear: input.namear,
      },
    };
    if (input.image) {
      const user = await CouponCategoriesModel.findById(id);

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
    const result = await CouponCategoriesModel.findByIdAndUpdate(id, replace);
    return result;
  }

  @Query(() => CouponCategories)
  async couponCategoryDt(@Arg("id") id: String): Promise<CouponCategories> {
    const CouponCategory = await CouponCategoriesModel.findById(id);
    return CouponCategory;
  }
}
