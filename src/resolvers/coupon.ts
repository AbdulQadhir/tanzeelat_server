import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import CouponModel, { Coupon } from "../models/Coupon";
import {
  CouponFilterInput,
  CouponFilterOutput,
  CouponInput,
  CouponSummary,
} from "..//gqlObjectTypes/coupon.type";
import { Types } from "mongoose";
import UserCouponModel from "../models/UserCoupon";
import { Context } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import VendorOutletModel from "../models/VendorOutlet";
import computeDistance from "../utils/Geo";
import VendorUserModel from "../models/VendorUser";
import { AZURE_CONTAINER } from "../constants/azure";
import { azureUpload, deleteFile } from "../utils/azure";

const path = require("path");

@Resolver()
export class CouponResolver {
  @Query(() => [CouponFilterOutput])
  async couponsWithFilter(
    @Arg("filter") filter: CouponFilterInput
    // @Ctx() ctx: Context
  ): Promise<CouponFilterOutput[]> {
    // const userId = ctx.userId || "";

    const today = new Date();

    const filterState =
      filter.state != ""
        ? {
            state: filter.state,
          }
        : {};

    const filterCategory =
      filter.id != "0"
        ? {
            "coupon.couponCategoryId": new Types.ObjectId(filter.id),
          }
        : {};

    const filterSearch =
      filter.search != ""
        ? {
            $or: [
              { "vendor.shopname": { $regex: filter.search, $options: "i" } },
              { "coupon.name": { $regex: filter.search, $options: "i" } },
            ],
          }
        : {};

    const filterVendorList = filter.vendorList
      ? {
          "vendor._id": {
            $in:
              filter.vendorList
                ?.filter((el) => el != "")
                .map((el) => new Types.ObjectId(el)) || [],
          },
        }
      : {};

    const filterCouponList = filter.categoryList
      ? {
          "coupon.couponCategoryId": {
            $in:
              filter.categoryList
                ?.filter((el) => el != "")
                .map((el) => new Types.ObjectId(el)) || [],
          },
        }
      : {};

    // const sortByDate = { "coupon.startDate": 1 };
    // const sortByDistance = { distance: 1 };
    // const sortByFeatured = { "coupon.featured": 1 };

    // const sortBy = filter.sortBy
    //   ? filter.sortBy == "new"
    //     ? sortByDate
    //     : filter.sortBy == "near"
    //     ? sortByDistance
    //     : filter.sortBy == "featured"
    //     ? sortByFeatured
    //     : sortByDate
    //   : sortByDate;

    // [11.0422869, 75.9925838]

    const filterDistance: any = filter.coordinates
      ? {
          $geoNear: {
            near: { type: "Point", coordinates: [11.0422869, 75.9925838] },
            distanceField: "distance",
            spherical: true,
          },
        }
      : {};

    let aggregation = [
      {
        $match: {
          ...filterState,
        },
      },
      {
        $lookup: {
          from: "coupons",
          localField: "_id",
          foreignField: "outlets",
          as: "coupon",
        },
      },
      {
        $unwind: {
          path: "$coupon",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          ...filterCategory,
          ...filterCouponList,
        },
      },
      {
        $group: {
          _id: "$coupon._id",
          outletId: {
            $first: "$_id",
          },
          outletName: {
            $first: "$name",
          },
          place: {
            $first: "$place",
          },
          state: {
            $first: "$state",
          },
          distance: {
            $first: "$distance",
          },
          workingHours: {
            $first: "$workingHours",
          },
          count: {
            $sum: 1,
          },
          vendorId: {
            $first: "$vendorId",
          },
          coupon: {
            $first: "$coupon",
          },
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
        $match: {
          ...filterSearch,
          ...filterVendorList,
        },
      },
      {
        $project: {
          distance: 1,
          "vendor._id": "$vendor._id",
          "vendor.shopname": "$vendor.shopname",
          "vendor.logo": "$vendor.logo",
          "outlet._id": "$outletId",
          "outlet.name": "$outletName",
          "outlet.state": "$state",
          "outlet.workingHours": "$workingHours",
          "coupon.name": "$coupon.name",
          "coupon.redeemLimit": "$coupon.redeemLimit",
          "coupon.description": "$coupon.description",
          "coupon.endDate": "$coupon.endDate",
          "coupon.startDate": "$coupon.startDate",
          "coupon.thumbnail": "$coupon.thumbnail",
          "coupon.thumbnailAr": "$coupon.thumbnailAr",
          "coupon.featured": "$coupon.featured",
          "coupon.code": "$coupon.code",
          "coupon.customDtTitle": "$coupon.customDtTitle",
          "coupon.customDtDescription": "$coupon.customDtDescription",
          "coupon.customDtTitleAr": "$coupon.customDtTitleAr",
          "coupon.customDtDescriptionAr": "$coupon.customDtDescriptionAr",
          "coupon.redeemType": "$coupon.redeemType",
          "coupon.storeType": "$coupon.storeType",
          endDate: {
            $add: [
              {
                $dateFromString: {
                  dateString: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$coupon.endDate",
                    },
                  },
                },
              },
              1 * 24 * 60 * 60000,
            ],
          },
        },
      },
      {
        $match: {
          ...filterSearch,
          endDate: { $gte: today },
        },
      },
      // {
      //   $sortBy: {
      //     ...sortBy
      //   }
      // },
    ];
    if (filter.coordinates) aggregation = [filterDistance, ...aggregation];

    const coupons = await VendorOutletModel.aggregate(aggregation);

    return coupons;
  }

  @Query(() => [Coupon])
  async otherCouponsOfVendor(
    @Arg("couponId") couponId: string
    // @Ctx() ctx: Context
  ): Promise<Coupon[]> {
    // const userId = ctx.userId || "";

    const coupon = await CouponModel.findById(couponId);
    const vendorId = coupon.vendorId;
    const today = new Date();

    const coupons = await CouponModel.aggregate([
      {
        $addFields: {
          endDate1: {
            $add: [
              {
                $dateFromString: {
                  dateString: {
                    $dateToString: { format: "%Y-%m-%d", date: "$endDate" },
                  },
                },
              },
              1 * 24 * 60 * 60000,
            ],
          },
        },
      },
      {
        $match: {
          vendorId: new Types.ObjectId(vendorId),
          _id: { $ne: new Types.ObjectId(couponId) },
          outlets: { $not: { $size: 0 } },
          endDate1: { $gt: today },
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outlets",
          foreignField: "_id",
          as: "outletsDt",
        },
      },
    ]);

    return coupons;
  }

  @Query(() => [Coupon])
  async coupons(
    @Arg("vendorId") vendorId: string,
    @Arg("subCategoryId") subCategoryId: string,
    @Ctx() ctx: Context
  ): Promise<Coupon[]> {
    const userId = ctx.userId || "";

    const coupons = await UserCouponModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          redeemed: false,
        },
      },
      {
        $lookup: {
          from: "coupons",
          localField: "couponId",
          foreignField: "_id",
          as: "coupons",
        },
      },
      {
        $unwind: {
          path: "$coupons",
        },
      },
      {
        $match: {
          "coupons.couponSubCategoryId": new Types.ObjectId(subCategoryId),
          "coupons.vendorId": new Types.ObjectId(vendorId),
        },
      },
      {
        $project: {
          _id: "$coupons._id",
          name: "$coupons.name",
          description: "$coupons.description",
          userCouponId: "$_id",
        },
      },
    ]);

    return coupons;
  }

  @Query(() => [String])
  async allCouponList(): Promise<String[]> {
    const today = new Date();

    const coupons = await CouponModel.aggregate([
      {
        $addFields: {
          endDate1: {
            $add: [
              {
                $dateFromString: {
                  dateString: {
                    $dateToString: { format: "%Y-%m-%d", date: "$endDate" },
                  },
                },
              },
              1 * 24 * 60 * 60000,
            ],
          },
        },
      },
      {
        $match: {
          outlets: { $not: { $size: 0 } },
          endDate1: { $gt: today },
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    return coupons.map((el) => el._id);
  }

  @Query(() => [Coupon])
  async couponsOfVendor(@Arg("vendorId") vendorId: string): Promise<Coupon[]> {
    const coupons = await CouponModel.find({ vendorId });
    return coupons;
  }

  @Query(() => [Coupon])
  async couponsOfVendorForApp(@Ctx() ctx: Context): Promise<Coupon[]> {
    const user = await VendorUserModel.findById(ctx.userId);

    const coupons = await CouponModel.find(
      { vendorId: user.vendorId },
      "_id name description endDate"
    ).sort({ createdAt: -1 });
    return coupons;
  }

  @Query(() => Coupon)
  async couponFullDt(
    @Arg("id") id: string,
    @Arg("coordinates") coordinates: string
  ): Promise<Coupon> {
    let coupons = await CouponModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outlets",
          foreignField: "_id",
          as: "outletsDt",
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
    ]);

    if (coordinates != "") {
      const strs = coordinates.split(",");
      const userLoc = [parseFloat(strs[0]) || 0, parseFloat(strs[1]) || 0];

      const tmp =
        coupons.length > 0 &&
        coupons[0].outletsDt?.map((outlet: any) => {
          return {
            ...outlet,
            distance: computeDistance(
              userLoc,
              outlet?.location?.coordinates || [0, 0]
            ),
          };
        });

      let cpn = coupons.length > 0 && coupons[0];
      cpn.outletsDt = tmp;

      return cpn;
    } else return coupons.length > 0 && coupons[0];
  }

  @Query(() => Coupon)
  async couponDt(@Arg("id") id: string): Promise<Coupon> {
    const coupons = await CouponModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outlets",
          foreignField: "_id",
          as: "outletsDt",
        },
      },
    ]);
    return coupons[0];
  }

  @Query(() => CouponSummary)
  async couponSummary(@Arg("id") id: String): Promise<CouponSummary> {
    const sent = await CouponModel.findById(id);
    const redeemed = await UserCouponModel.count({ couponId: id });
    return {
      sent: sent?.redeemLimit || 0,
      redeemed: redeemed || 0,
    };
  }

  // @Mutation(() => Boolean)
  // async setCodes(
  // ): Promise<Boolean> {

  //     const cpns = await CouponModel.find();

  //     for (const cpn of cpns) {
  //         await CouponModel.updateOne({_id:cpn._id},{
  //             $set: {
  //                 code: Math.floor(100000 + Math.random() * 900000)
  //             }
  //         })
  //       }

  //     return true;
  // }

  @Mutation(() => Coupon)
  async addCoupon(
    @Arg("input") input: CouponInput,
    @Ctx() ctx: Context
  ): Promise<Coupon> {
    let menu: any = null;
    let thumbnail: any = null;
    let thumbnailAr: any = null;
    if (input.menu) {
      const { createReadStream, filename } = await input?.menu;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.COUPON
      );

      menu = Location;
    }
    if (input.thumbnail) {
      const { createReadStream, filename } = await input?.thumbnail;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.COUPON
      );

      thumbnail = Location;
    }
    if (input.thumbnailAr) {
      const { createReadStream, filename } = await input?.thumbnailAr;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.COUPON
      );

      thumbnailAr = Location;
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const coupon = new CouponModel({
      ...input,
      menu,
      thumbnail,
      thumbnailAr,
      code,
    });
    const result = await coupon.save();
    return result;
  }

  @Mutation(() => Coupon)
  async updateCoupon(
    @Arg("input") input: CouponInput,
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<Coupon> {
    console.log(input.menu);
    let replace: any = {};
    replace = {
      // const result = await CouponModel.findByIdAndUpdate(id,{
      $set: {
        name: input.name,
        namear: input.namear,
        description: input.description,
        descriptionar: input.descriptionar,
        startDate: input.startDate,
        endDate: input.endDate,
        terms: input.terms,
        termsar: input.termsar,
        couponCategoryId: input.couponCategoryId,
        couponSubCategoryId: input.couponSubCategoryId,
        outlets: input.outlets,
        redeemLimit: input.redeemLimit,
      },
    };
    if (input.menu) {
      const user = await CouponModel.findById(id);

      const { createReadStream, filename } = await input?.menu;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.COUPON
      );

      if (user.menu) deleteFile(AZURE_CONTAINER.COUPON, user.menu);

      console.log(Location);
      replace.$set["menu"] = Location;
    }
    if (input.thumbnail) {
      const user = await CouponModel.findById(id);

      const { createReadStream, filename } = await input?.thumbnail;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.COUPON
      );

      if (user.menu) deleteFile(AZURE_CONTAINER.COUPON, user.thumbnail);

      console.log(Location);
      replace.$set["thumbnail"] = Location;
    }
    if (input.thumbnailAr) {
      const user = await CouponModel.findById(id);

      const { createReadStream, filename } = await input?.thumbnailAr;

      const fileStream = createReadStream();
      let streamSize = parseInt(ctx.content_length);

      const Location = await azureUpload(
        `${uuidv4()}${path.extname(filename)}`,
        fileStream,
        streamSize,
        AZURE_CONTAINER.COUPON
      );

      if (user.menu) deleteFile(AZURE_CONTAINER.COUPON, user.thumbnailAr);

      replace.$set["thumbnailAr"] = Location;
    }
    const result = await CouponModel.findByIdAndUpdate(id, replace);
    return result;
  }
}
