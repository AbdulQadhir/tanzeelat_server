import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import {
  ProductBulkInput,
  ProductBulkListInput,
  ProductFilters,
  ProductInput,
  ProductListResponse,
  ProductsByCategoryOutput,
} from "../gqlObjectTypes/product.type";
import { v4 as uuidv4 } from "uuid";
import ProductModel, { Product } from "../models/Products";
import { Types } from "mongoose";
import { AZURE_CONTAINER } from "../constants/azure";
import { azureUpload, deleteFile } from "../utils/azure";
import { Context } from "@apollo/client";

const path = require("path");

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  async allProducts(@Arg("filter") filter: ProductFilters): Promise<Product[]> {
    const today = new Date();

    const filterCategory =
      filter.productCategoryId != "0"
        ? {
            productCategoryId: new Types.ObjectId(filter.productCategoryId),
          }
        : {};

    const products = await ProductModel.aggregate([
      {
        $match: {
          ...filterCategory,
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
        },
      },
      {
        $lookup: {
          from: "catalogs",
          localField: "catalogId",
          foreignField: "_id",
          as: "catalog",
        },
      },
      {
        $unwind: {
          path: "$catalog",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "catalog.expiry": { $ifNull: ["$catalog.expiry", today] },
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: filter.search || "", $options: "i" } },
            {
              "vendor.shopname": { $regex: filter.search || "", $options: "i" },
            },
          ],
          "catalog.expiry": { $gte: today },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
    return products;
  }

  @Query(() => [ProductsByCategoryOutput])
  async allProductsByCategory(
    @Arg("filter") filter: ProductFilters
  ): Promise<ProductsByCategoryOutput[]> {
    const today = new Date();

    const filterVendorList = filter.vendorList
      ? {
          vendorId: {
            $in:
              filter.vendorList
                ?.filter((el) => el != "")
                .map((el) => new Types.ObjectId(el)) || [],
          },
        }
      : {};

    const filterCategoryList = filter.categoryList
      ? {
          productCategoryId: {
            $in:
              filter.categoryList
                ?.filter((el) => el != "")
                .map((el) => new Types.ObjectId(el)) || [],
          },
        }
      : {};

    const products = await ProductModel.aggregate([
      {
        $match: {
          ...filterVendorList,
          ...filterCategoryList,
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "productCategoryId",
          foreignField: "_id",
          as: "productCategory",
        },
      },
      {
        $unwind: {
          path: "$productCategory",
        },
      },
      {
        $lookup: {
          from: "catalogs",
          localField: "catalogId",
          foreignField: "_id",
          as: "catalog",
        },
      },
      {
        $unwind: {
          path: "$catalog",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: filter.search || "", $options: "i" } },
            {
              "vendor.shopname": { $regex: filter.search || "", $options: "i" },
            },
          ],
          "catalog.expiry": { $gte: today },
        },
      },
      {
        $group: {
          _id: "$productCategoryId",
          productCategory: {
            $first: "$productCategory.name",
          },
          products: {
            $push: {
              name: "$name",
              namear: "$namear",
              price: "$price",
              offerPrice: "$offerPrice",
              image: "$image",
              vendor: {
                _id: "$vendor._id",
                shopname: "$vendor.shopname",
                logo: "$vendor.logo",
              },
            },
          },
        },
      },
    ]);

    return products;
  }

  @Query(() => [ProductListResponse])
  async productsByVendor(
    @Arg("vendorId") vendorId: string
  ): Promise<ProductListResponse[]> {
    console.log(vendorId);
    return await ProductModel.aggregate([
      {
        $match: {
          vendorId: new Types.ObjectId(vendorId),
          catalogId: { $exists: false },
        },
      },
      {
        $group: {
          _id: "$productSubCategoryId",
          productSubCategoryId: {
            $first: "$productCategoryId",
          },
          products: {
            $push: {
              id: "$_id",
              name: "$name",
              image: "$image",
            },
          },
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "productSubCategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      {
        $unwind: {
          path: "$subcategory",
        },
      },
      {
        $project: {
          subcategoryId: "$productSubCategoryId",
          subcategory: "$subcategory.name",
          products: 1,
        },
      },
    ]);
  }

  @Query(() => [Product])
  async productsInCatalog(
    @Arg("input") input: ProductBulkListInput
  ): Promise<Product[]> {
    return await ProductModel.aggregate([
      {
        $match: {
          catalogId: new Types.ObjectId(input.catalogId),
          pageNo: input.pageNo,
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "productCategoryId",
          foreignField: "_id",
          as: "productCategory",
        },
      },
      {
        $unwind: {
          path: "$productCategory",
        },
      },
    ]);
  }

  @Mutation(() => Product)
  async addProduct(
    @Arg("input") input: ProductInput,
    @Ctx() ctx: Context
  ): Promise<Product> {
    let image: any = "";

    if (input.image) {
      const { createReadStream, filename } = await input?.image;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.PRODUCT
      );
      image = Location;
    }

    const product = new ProductModel({
      name: input.name,
      namear: input.namear,
      price: input.price,
      offerPrice: input.offerPrice,
      vendorId: input.vendorId,
      productCategoryId: input.productCategoryId,
      productSubCategoryId: input.productSubCategoryId,
      image,
    });

    const result = await product.save();
    return result;
  }

  @Mutation(() => Product)
  async addProductBulk(
    @Arg("input") input: ProductBulkInput,
    @Ctx() ctx: Context
  ): Promise<Product> {
    let image: any = "";

    if (input.image) {
      const { createReadStream, filename } = await input?.image;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.PRODUCT
      );
      image = Location;
    }

    const product = new ProductModel({
      name: input.name,
      namear: input.namear,
      price: input.price,
      offerPrice: input.offerPrice,
      vendorId: input.vendorId,
      catalogId: input.catalogId,
      pageNo: input.pageNo,
      productCategoryId: input.productCategoryId,
      productSubCategoryId: input.productSubCategoryId,
      image,
    });

    const result = await product.save();
    return result;
  }

  @Mutation(() => Boolean)
  async delProduct(@Arg("id") id: string): Promise<Boolean> {
    const product = await ProductModel.findById(id);

    if (product.image) deleteFile(AZURE_CONTAINER.PRODUCT, product.image);

    await ProductModel.findByIdAndDelete(id);
    return true;
  }
}
