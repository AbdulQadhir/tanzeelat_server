import "reflect-metadata";
import { ProductSubCategoryInput } from "../gqlObjectTypes/productcategories.types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import ProductSubCategoriesModel, {
  ProductSubCategories,
} from "../models/ProductSubCategory";

const path = require("path");

import { v4 as uuidv4 } from "uuid";
import { azureUpload, deleteFile } from "../utils/azure";
import { Context } from "@apollo/client";
import { AZURE_CONTAINER } from "../constants/azure";

@Resolver()
export class ProductSubCatagoriesResolver {
  @Query(() => [ProductSubCategories])
  async productSubCategories(
    @Arg("id") id: string
  ): Promise<ProductSubCategories[]> {
    const cats = await ProductSubCategoriesModel.find({
      productCategoryId: id,
    });
    return cats;
  }

  @Mutation(() => ProductSubCategories)
  async addProductSubCategory(
    @Arg("input") input: ProductSubCategoryInput,
    @Ctx() ctx: Context
  ): Promise<ProductSubCategories> {
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
      console.log(Location);
      image = Location;
    }
    const user = new ProductSubCategoriesModel({
      name: input.name,
      namear: input.namear,
      productCategoryId: input.productCategoryId,
      image,
    });
    const result = await user.save();
    return result;
  }

  @Mutation(() => ProductSubCategories)
  async updProductSubCategory(
    @Arg("input") input: ProductSubCategoryInput,
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<ProductSubCategories> {
    let replace: any = {};
    replace = {
      $set: {
        name: input.name,
        namear: input.namear,
        productCategoryId: input.productCategoryId,
      },
    };
    if (input.image) {
      const user = await ProductSubCategoriesModel.findById(id);

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

      console.log(Location);
      replace.$set["image"] = Location;
    }
    const result = await ProductSubCategoriesModel.findByIdAndUpdate(
      id,
      replace
    );
    return result;
  }

  @Query(() => ProductSubCategories)
  async productSubCategoryDt(
    @Arg("id") id: String
  ): Promise<ProductSubCategories> {
    const ProductSubCategory = await ProductSubCategoriesModel.findById(id);
    return ProductSubCategory;
  }
}
