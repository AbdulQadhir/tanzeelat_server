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

const path = require("path");
const AWS = require("aws-sdk");
const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";
const BUCKET_NAME = "tanzeelat";
@Resolver()
export class CouponResolver {
  @Query(() => [CouponFilterOutput])
  async couponsWithFilter(
    @Arg("filter") filter: CouponFilterInput
    // @Ctx() ctx: Context
  ): Promise<CouponFilterOutput[]> {
    // const userId = ctx.userId || "";

    console.log(filter);
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
            "coupon.couponCategoryId": Types.ObjectId(filter.id),
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

    const sortBy = filter.sortBy
      ? filter.sortBy == "new"
        ? {
            "coupon.startDate": 1,
          }
        : filter.sortBy == "near"
        ? {
            distance: 1,
          }
        : filter.sortBy == "featured"
        ? {
            "coupon.featured": 1,
          }
        : { "coupon.startDate": 1 }
      : { "coupon.startDate": 1 };

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
        },
      },
      {
        $group: {
          _id: "$coupon._id",
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
        $project: {
          distance: 1,
          "vendor._id": "$vendor._id",
          "vendor.shopname": "$vendor.shopname",
          "vendor.logo": "$vendor.logo",
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
      {
        $sort: {
          ...sortBy,
        },
      },
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
          vendorId: Types.ObjectId(vendorId),
          _id: { $ne: Types.ObjectId(couponId) },
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
          userId: Types.ObjectId(userId),
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
          "coupons.couponSubCategoryId": Types.ObjectId(subCategoryId),
          "coupons.vendorId": Types.ObjectId(vendorId),
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
          _id: Types.ObjectId(id),
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
          _id: Types.ObjectId(id),
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
  async addCoupon(@Arg("input") input: CouponInput): Promise<Coupon> {
    let menu = "";
    let thumbnail = "";
    let thumbnailAr = "";
    if (input.menu) {
      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });
      const { createReadStream, filename, mimetype } = await input.menu;
      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();
      menu = Location;
    }
    if (input.thumbnail) {
      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });
      const { createReadStream, filename, mimetype } = await input.thumbnail;
      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();
      thumbnail = Location;
    }
    if (input.thumbnailAr) {
      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });
      const { createReadStream, filename, mimetype } = await input.thumbnailAr;
      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();
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
    @Arg("id") id: string
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

      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });

      const { createReadStream, filename, mimetype } = await input.menu;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      if (user.menu)
        try {
          await s3
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: user.logo.split("/").pop(),
            })
            .promise();
          console.log("file deleted Successfully");
        } catch (err) {
          console.log("ERROR in file Deleting : " + JSON.stringify(err));
        }
      console.log(Location);
      replace.$set["menu"] = Location;
    }
    if (input.thumbnail) {
      const user = await CouponModel.findById(id);

      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });

      const { createReadStream, filename, mimetype } = await input.thumbnail;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      if (user.thumbnail)
        try {
          await s3
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: user.logo.split("/").pop(),
            })
            .promise();
          console.log("file deleted Successfully");
        } catch (err) {
          console.log("ERROR in file Deleting : " + JSON.stringify(err));
        }
      console.log(Location);
      replace.$set["thumbnail"] = Location;
    }
    if (input.thumbnailAr) {
      const user = await CouponModel.findById(id);

      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });

      const { createReadStream, filename, mimetype } = await input.thumbnailAr;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      if (user.thumbnailAr)
        try {
          await s3
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: user.logo.split("/").pop(),
            })
            .promise();
          console.log("file deleted Successfully");
        } catch (err) {
          console.log("ERROR in file Deleting : " + JSON.stringify(err));
        }
      console.log(Location);
      replace.$set["thumbnailAr"] = Location;
    }
    const result = await CouponModel.findByIdAndUpdate(id, replace);
    return result;
  }
}
