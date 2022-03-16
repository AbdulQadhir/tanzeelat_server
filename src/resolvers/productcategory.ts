import "reflect-metadata";
import {
  ProductCategoryInput,
  ProductCategoryListOutput,
} from "../gqlObjectTypes/productcategories.types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import ProductCategoriesModel, {
  ProductCategories,
} from "../models/ProductCategories";
import ProductSubCategoriesModel from "../models/ProductSubCategory";

const path = require("path");

import { v4 as uuidv4 } from "uuid";
import { azureUpload, deleteFile } from "../utils/azure";
import { AZURE_CONTAINER } from "../constants/azure";
import { Context } from "@apollo/client";

@Resolver()
export class ProductCatagoriesResolver {
  @Query(() => [ProductCategories])
  async productCategories(): Promise<ProductCategories[]> {
    const cats = await ProductCategoriesModel.find();
    console.log(cats);
    return cats;
  }

  @Query(() => [ProductCategories])
  async productCategoriesDt(
    @Arg("search") search: string
  ): Promise<ProductCategories[]> {
    const cats = await ProductCategoriesModel.aggregate([
      {
        $lookup: {
          from: "productsubcategories",
          localField: "_id",
          foreignField: "productCategoryId",
          as: "subcategories",
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { namear: { $regex: search, $options: "i" } },
            { "subcategories.name": { $regex: search, $options: "i" } },
            { "subcategories.namear": { $regex: search, $options: "i" } },
          ],
        },
      },
    ]);
    return cats;
  }

  @Query(() => [ProductCategoryListOutput])
  async productCategoryList(): Promise<ProductCategoryListOutput[]> {
    const cats = await ProductSubCategoriesModel.aggregate([
      {
        $group: {
          _id: "$productCategoryId",
          productCategoryId: {
            $first: "$productCategoryId",
          },
          subCategories: {
            $push: { name: "$name", namear: "$namear", id: "$_id" },
          },
        },
      },
    ]);
    const res = await ProductSubCategoriesModel.populate(cats, {
      path: "productCategoryId",
    });
    return res;
  }

  @Mutation(() => ProductCategories)
  async addProductCategory(
    @Arg("input") input: ProductCategoryInput,
    @Ctx() ctx: Context
  ): Promise<ProductCategories> {
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
    const user = new ProductCategoriesModel({
      name: input.name,
      namear: input.namear,
      image,
    });
    const result = await user.save();
    return result;
  }

  @Mutation(() => ProductCategories)
  async updProductCategory(
    @Arg("input") input: ProductCategoryInput,
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<ProductCategories> {
    let replace: any = {};
    replace = {
      $set: {
        name: input.name,
        namear: input.namear,
      },
    };
    if (input.image) {
      const user = await ProductCategoriesModel.findById(id);

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
    const result = await ProductCategoriesModel.findByIdAndUpdate(id, replace);
    return result;
  }

  @Query(() => ProductCategories)
  async productCategoryDt(@Arg("id") id: String): Promise<ProductCategories> {
    const ProductCategory = await ProductCategoriesModel.findById(id);
    return ProductCategory;
  }
}
