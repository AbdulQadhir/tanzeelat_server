import "reflect-metadata";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import CatalogModel, { Catalog } from "../models/Catalog";
import {
  CatalogInput,
  CatalogFilters,
  CatalogOutput,
  ActiveCatalogOutput,
  BookmarkInput,
} from "../gqlObjectTypes/catalog.type";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import { Context } from "vm";
import { checkVendorAccess } from "./auth";
import { CatalogStatus } from "../enums/catalogstatus.enum";
import VendorOutletModel from "../models/VendorOutlet";
import VendorUserModel from "../models/VendorUser";
import { fromPath } from "pdf2pic";
import { WriteImageResponse } from "pdf2pic/dist/types/writeImageResponse";
import { azureUpload, azureUploadfromFile } from "../utils/azure";
import { AZURE_CONTAINER } from "../constants/azure";

const fs = require("fs");

const path = require("path");

@Resolver()
export class CatalogResolver {
  @Query(() => [Catalog])
  async catalogs(
    @Arg("vendorId") vendorId: string,
    @Ctx() ctx: Context
  ): Promise<Catalog[]> {
    const today = new Date();
    if (ctx.userType == "VENDOR") {
      const vendorUser = await VendorUserModel.findById(ctx.userId);
      const catalogs = await CatalogModel.aggregate([
        {
          $match: {
            outlets: {
              $in:
                vendorUser?.outlets.map(
                  (el: Types.ObjectId) => new Types.ObjectId(el.toString())
                ) || [],
            },
          },
        },
        {
          $lookup: {
            from: "catalogpriorities",
            localField: "_id",
            foreignField: "catalogId",
            as: "rank",
          },
        },
        {
          $unwind: {
            path: "$rank",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $project: {
            _id: 1,
            id: "$_id",
            title: 1,
            status: 1,
            enabled: 1,
            expired: { $gte: [today, "$expiry"] },
            rank: "$rank.rank",
          },
        },
      ]);
      return catalogs;
    } else {
      const access = await checkVendorAccess(vendorId, ctx.userId);
      if (!access) {
      } //    throw new Error("Unauthorized!");x

      const catalogs = await CatalogModel.aggregate([
        {
          $match: {
            vendorId: new Types.ObjectId(vendorId),
          },
        },
        {
          $lookup: {
            from: "catalogpriorities",
            localField: "_id",
            foreignField: "catalogId",
            as: "rank",
          },
        },
        {
          $unwind: {
            path: "$rank",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            id: "$_id",
            title: 1,
            status: 1,
            enabled: 1,
            expired: { $gte: [today, "$expiry"] },
            rank: "$rank.rank",
          },
        },
        {
          $sort: {
            expired: 1,
            enabled: -1,
            _id: -1,
          },
        },
      ]);
      return catalogs;
    }
  }

  @Query(() => [Catalog])
  async otherCatalogsOfVendor(
    @Arg("catalogId") catalogId: string,
    @Arg("state") state: string
  ): Promise<Catalog[]> {
    const today = new Date();

    const _tmp = await CatalogModel.findById(catalogId);
    const vendorId = _tmp.vendorId;

    const catalogs = await CatalogModel.aggregate([
      {
        $match: {
          vendorId: new Types.ObjectId(vendorId),
          _id: {
            $ne: new Types.ObjectId(catalogId),
          },
          status: "ACCEPTED",
          expiry: { $gte: today },
          startDate: { $lte: today },
          enabled: true,
          pdf: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outlets",
          foreignField: "_id",
          as: "outlets",
        },
      },
      {
        $match: {
          "outlets.state": state,
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
    return catalogs;
  }

  @Query(() => [ActiveCatalogOutput])
  async activeCatalogs(
    @Arg("filter") filter: CatalogFilters,
    @Arg("state") state: string
  ): Promise<ActiveCatalogOutput[]> {
    let filters: any = {};

    if ((filter.vendorId?.filter((el) => el != "").length || 0) > 0)
      filters["vendor._id"] = {
        $in:
          filter.vendorId
            ?.filter((el) => el != "")
            .map((el) => new Types.ObjectId(el)) || [],
      };
    if (filter?.category)
      filters.catalogCategoryId = {
        $in: [new Types.ObjectId(filter.category)],
      };

    if (filter?.categoryList)
      filters.catalogCategoryId = {
        $in:
          filter.categoryList
            ?.filter((el) => el != "")
            .map((el) => new Types.ObjectId(el)) || [],
      };
    if (filter?.search)
      filters["$or"] = [
        { title: { $regex: filter.search, $options: "i" } },
        { "outlet.name": { $regex: filter.search, $options: "i" } },
        { "outlet.namear": { $regex: filter.search, $options: "i" } },
        { "outlet.state": { $regex: filter.search, $options: "i" } },
      ];
    if (filter?.state) filters["outlet.state"] = filter.state;

    const today = new Date();
    var yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const last4 = await CatalogModel.aggregate([
      {
        $match: {
          status: "ACCEPTED",
          createdAt: { $gte: yesterday },
          enabled: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 4,
      },
      {
        $project: {
          title: 1,
          createdAt: 1,
        },
      },
    ]);

    const _last4 = last4.map((el) => el._id);

    const last4Catalogs = await CatalogModel.aggregate([
      {
        $match: {
          _id: { $in: _last4 },
        },
      },
      {
        $lookup: {
          from: "catalogpriorities",
          localField: "_id",
          foreignField: "catalogId",
          as: "rank",
        },
      },
      {
        $unwind: {
          path: "$rank",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          vendorId: 1,
          title: 1,
          titlear: 1,
          outlets: 1,
          pages: 1,
          thumbnails: 1,
          outletCopy: "$outlets",
          catalogCategoryId: 1,
          catalogId: "$_id",
          expiry: 1,
          startDate: 1,
          status: 1,
          pdf: 1,
          rank: { $ifNull: ["$rank.rank", 99] },
          endDate: {
            $add: [
              {
                $dateFromString: {
                  dateString: {
                    $dateToString: { format: "%Y-%m-%d", date: "$expiry" },
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
          endDate: { $gte: today },
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outlets",
          foreignField: "_id",
          as: "outlets",
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
        $unwind: {
          path: "$outletCopy",
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outletCopy",
          foreignField: "_id",
          as: "outlet",
        },
      },
      {
        $unwind: {
          path: "$outlet",
        },
      },
      {
        $sort: {
          "vendor.grade": 1,
          rank: -1,
        },
      },
      {
        $match: {
          "vendor.active": true,
          ...filters,
        },
      },
      {
        $group: {
          _id: {
            state: "$outlet.state",
            catalogId: "$catalogId",
          },
          catalogId: { $first: "$catalogId" },
          state: { $first: "$outlet.state" },
          catalogs: {
            $first: {
              _id: "$catalogId",
              id: "$catalogId",
              catalogCategoryId: "$catalogCategoryId",
              title: "$title",
              titlear: "$titlear",
              outletName: "$outlet.name",
              outlet: {
                name: "$outlet.name",
                namear: "$outlet.namear",
                state: "$outlet.state",
                place: "$outlet.place",
              },
              vendor: {
                _id: "$vendor._id",
                logo: "$vendor.logo",
                shopname: "$vendor.shopname",
              },
              pages: "$pages",
              thumbnails: "$thumbnails",
              outlets: "$outlets",
              expiry: "$expiry",
              pdf: "$pdf",
            },
          },
        },
      },
      {
        $group: {
          _id: "$state",
          state: {
            $first: "$state",
          },
          catalogs: {
            $push: "$catalogs",
          },
        },
      },
    ]);

    const catalogs = await CatalogModel.aggregate([
      {
        $match: {
          status: "ACCEPTED",
          startDate: { $lte: today },
          enabled: true,
          _id: { $nin: _last4 },
        },
      },
      {
        $lookup: {
          from: "catalogpriorities",
          localField: "_id",
          foreignField: "catalogId",
          as: "rank",
        },
      },
      {
        $unwind: {
          path: "$rank",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          vendorId: 1,
          title: 1,
          titlear: 1,
          outlets: 1,
          pages: 1,
          thumbnails: 1,
          outletCopy: "$outlets",
          catalogCategoryId: 1,
          catalogId: "$_id",
          expiry: 1,
          startDate: 1,
          status: 1,
          pdf: 1,
          rank: { $ifNull: ["$rank.rank", 99] },
          endDate: {
            $add: [
              {
                $dateFromString: {
                  dateString: {
                    $dateToString: { format: "%Y-%m-%d", date: "$expiry" },
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
          endDate: { $gte: today },
          pdf: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outlets",
          foreignField: "_id",
          as: "outlets",
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
        $unwind: {
          path: "$outletCopy",
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outletCopy",
          foreignField: "_id",
          as: "outlet",
        },
      },
      {
        $unwind: {
          path: "$outlet",
        },
      },
      {
        $sort: {
          "vendor.grade": 1,
          rank: -1,
        },
      },
      {
        $match: {
          "vendor.active": true,
          ...filters,
        },
      },
      {
        $group: {
          _id: {
            state: "$outlet.state",
            catalogId: "$catalogId",
          },
          catalogId: { $first: "$catalogId" },
          state: { $first: "$outlet.state" },
          catalogs: {
            $first: {
              _id: "$catalogId",
              id: "$catalogId",
              catalogCategoryId: "$catalogCategoryId",
              title: "$title",
              titlear: "$titlear",
              outletName: "$outlet.name",
              outlet: {
                name: "$outlet.name",
                namear: "$outlet.namear",
                state: "$outlet.state",
                place: "$outlet.place",
              },
              vendor: {
                _id: "$vendor._id",
                logo: "$vendor.logo",
                shopname: "$vendor.shopname",
              },
              pages: "$pages",
              thumbnails: "$thumbnails",
              outlets: "$outlets",
              expiry: "$expiry",
              pdf: "$pdf",
            },
          },
        },
      },
      {
        $group: {
          _id: "$state",
          state: {
            $first: "$state",
          },
          catalogs: {
            $push: "$catalogs",
          },
        },
      },
    ]);

    last4Catalogs.sort(function (x, y) {
      return x.state == state ? -1 : y.state == state ? 1 : 0;
    });

    last4Catalogs.forEach((el, index) => {
      const cats = catalogs.find((e) => e.state == el.state)?.catalogs || [];
      last4Catalogs[index].catalogs.push(...cats);
    });

    return last4Catalogs;
  }

  @Query(() => [Catalog])
  async activeCatalogsOfVendor(@Ctx() ctx: Context): Promise<Catalog[]> {
    // const today = new Date();

    const user = await VendorUserModel.findById(ctx.userId);

    const catalogs = await CatalogModel.aggregate([
      {
        $match: {
          vendorId: new Types.ObjectId(user.vendorId),
          status: "ACCEPTED",
          enabled: true,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    return catalogs;
  }

  @Query(() => [CatalogOutput])
  async bookmarkedCatalogs(
    @Arg("bookmarks") bookmarks: BookmarkInput
  ): Promise<CatalogOutput[]> {
    const _bookmarks = bookmarks?.bookmarks?.map(
      (el) => new Types.ObjectId(el.toString())
    );

    const today = new Date();

    const catalogs = await CatalogModel.aggregate([
      {
        $match: {
          status: "ACCEPTED",
          expiry: { $gte: today },
          startDate: { $lte: today },
          _id: { $in: _bookmarks },
          pdf: { $exists: true },
        },
      },
      {
        $project: {
          vendorId: 1,
          title: 1,
          titlear: 1,
          outlets: 1,
          pages: 1,
          pdf: 1,
          thumbnails: 1,
          outletCopy: "$outlets",
          catalogCategoryId: 1,
          catalogId: "$_id",
          expiry: 1,
          startDate: 1,
          status: 1,
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "outlets",
          foreignField: "_id",
          as: "outlets",
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
          _id: "$catalogId",
          id: "$catalogId",
          catalogCategoryId: "$catalogCategoryId",
          title: "$title",
          titlear: "$titlear",
          outletName: { $first: "$outlets.name" },
          outlet: {
            name: { $first: "$outlets.name" },
            namear: { $first: "$outlets.namear" },
            state: { $first: "$outlets.state" },
            place: { $first: "$outlets.place" },
          },
          vendor: {
            _id: "$vendor._id",
            logo: "$vendor.logo",
            shopname: "$vendor.shopname",
          },
          pages: "$pages",
          pdf: "$pdf",
          thumbnails: "$thumbnails",
          outlets: "$outlets",
          expiry: "$expiry",
        },
      },
    ]);

    return catalogs;
  }

  @Query(() => [CatalogOutput])
  async nearCatalogs(@Arg("coords") coords: String): Promise<CatalogOutput[]> {
    let _coords: [number, number] = [
      parseFloat(coords.split(",")[0] || "") || 0,
      parseFloat(coords.split(",")[1] || "") || 0,
    ];
    console.log(_coords);

    const today = new Date();
    // const yesterday = new Date().setDate(new Date().getDate()-1)

    const catalogs = await VendorOutletModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: _coords,
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "catalogs",
          localField: "_id",
          foreignField: "outlets",
          as: "catalogs",
        },
      },
      {
        $unwind: {
          path: "$catalogs",
        },
      },
      {
        $match: {
          "catalogs.enabled": true,
          "catalogs.status": "ACCEPTED",
          "catalogs.startDate": { $lte: today },
          "catalogs.expiry": { $gte: today },
          "catalogs.pdf": { $exists: true },
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
          "vendor.active": true,
        },
      },
      {
        $lookup: {
          from: "vendoroutlets",
          localField: "catalogs.outlets",
          foreignField: "_id",
          as: "outlets",
        },
      },
      {
        $project: {
          _id: "$catalogs._id",
          id: "$catalogs._id",
          title: "$catalogs.title",
          titlear: "$catalogs.titlear",
          expiry: "$catalogs.expiry",
          status: "$catalogs.status",
          startDate: "$catalogs.startDate",
          pages: "$catalogs.pages",
          pdf: "$catalogs.pdf",
          thumbnails: "$catalogs.thumbnails",
          "vendor._id": 1,
          "vendor.shopname": 1,
          "vendor.logo": 1,
          "vendor.outlets": 1,
          "vendor.active": 1,
          outlet: {
            name: "$name",
            state: "$state",
            place: "$place",
            location: "$location",
            distance: "$distance",
          },
          outlets: "$outlets",
        },
      },
      {
        $group: {
          _id: "$vendor._id",
          id: { $first: "$id" },
          title: {
            $first: "$title",
          },
          titlear: {
            $first: "$titlear",
          },
          expiry: {
            $first: "$expiry",
          },
          status: {
            $first: "$status",
          },
          startDate: {
            $first: "$startDate",
          },
          pages: {
            $first: "$pages",
          },
          pdf: {
            $first: "$pdf",
          },
          thumbnails: {
            $first: "$thumbnails",
          },
          vendor: {
            $first: {
              _id: "$vendor._id",
              shopname: "$vendor.shopname",
              logo: "$vendor.logo",
              active: "$vendor.active",
            },
          },
          outlet: {
            $first: {
              name: "$outlet.name",
              state: "$outlet.state",
              place: "$outlet.place",
              location: "$outlet.location",
              distance: "$outlet.distance",
            },
          },
          outlets: {
            $first: "$outlets",
          },
        },
      },
      {
        $sort: {
          "outlet.distance": 1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return catalogs;
  }

  @Query(() => Catalog)
  async catalogDt(@Arg("id") id: string): Promise<Catalog> {
    const catalogs = await CatalogModel.aggregate([
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
          as: "outlets",
        },
      },
      {
        $lookup: {
          from: "catalogcategories",
          localField: "catalogCategoryId",
          foreignField: "_id",
          as: "catalogCategoryDt",
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
    return catalogs.length > 0 && catalogs[0];
  }

  @Query(() => [CatalogOutput])
  async catalogRequests(): Promise<CatalogOutput[]> {
    return await CatalogModel.find(
      { status: CatalogStatus.PENDING },
      "id title vendorId startDate"
    ).populate("vendorId", "id shopname");
  }

  @Mutation(() => Boolean)
  async catalogAction(
    @Arg("id") id: string,
    @Arg("action") action: string
  ): Promise<Boolean> {
    const status =
      action == "approve" ? CatalogStatus.ACCEPTED : CatalogStatus.REJECTED;
    const result = await CatalogModel.findByIdAndUpdate(id, {
      $set: {
        status,
      },
    });
    return result ? true : false;
  }

  @Mutation(() => Boolean)
  async updCatalogEnabled(
    @Arg("catalogId") catalogId: string,
    @Arg("enabled") enabled: Boolean
  ): Promise<Boolean> {
    console.log(enabled);
    await CatalogModel.findByIdAndUpdate(catalogId, {
      $set: {
        enabled,
      },
    });
    return true;
  }

  @Mutation(() => Boolean)
  async updCatalogExpDate(
    @Arg("catalogId") catalogId: string,
    @Arg("expiry") expiry: string
  ): Promise<Boolean> {
    await CatalogModel.findByIdAndUpdate(catalogId, {
      $set: {
        expiry,
      },
    });
    return true;
  }

  @Mutation(() => Catalog)
  async addCatalog(
    @Arg("input") input: CatalogInput,
    @Ctx() ctx: Context
  ): Promise<Catalog> {
    const { createReadStream, filename } = await input?.pdf;

    const fileStream = createReadStream();
    let streamSize = parseInt(ctx.content_length);

    const pdfLocation = await azureUpload(
      `${uuidv4()}${path.extname(filename)}`,
      fileStream,
      streamSize,
      AZURE_CONTAINER.PDF
    );

    const stream = createReadStream();
    const pathObj: any = await storeFS(stream, filename);

    const options = {
      density: 100,
      saveFilename: "untitled",
      // savePath: "/Users/ncod/Documents/tmp",
      // savePath: "/tmp/tan_pdf",  //for aws
      savePath: "/home/azureuser/tmp", //for azure
      format: "png",
      width: 200,
      height: 270,
    };
    const convert = fromPath(pathObj.path, options);

    let imgs: WriteImageResponse[] = [];

    if (convert.bulk) imgs = await convert.bulk(-1);

    let thumbs = [];

    for (const img of imgs) {
      const Location = await azureUploadfromFile(
        `${uuidv4()}${path.extname(img.path)}`,
        img.path,
        AZURE_CONTAINER.THUMBNAIL
      );

      // console.log(Location);
      thumbs.push(Location);
    }

    const user = new CatalogModel({
      ...input,
      pdf: pdfLocation,
      thumbnails: thumbs,
    });
    const result = await user.save();
    return result;
  }

  @Mutation(() => Catalog)
  async updateCatalog(
    @Arg("input") input: CatalogInput,
    @Arg("id") id: string
  ): Promise<Catalog> {
    const result = await CatalogModel.findByIdAndUpdate(id, {
      $set: {
        title: input.title,
        titlear: input.titlear,
        catalogCategoryId: input.catalogCategoryId,
        startDate: input.startDate,
        expiry: input.expiry,
        outlets: input.outlets,
      },
    });

    return result;
  }
}
const storeFS = (stream: any, filename: any) => {
  const uploadDir = "/tmp";
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", (error: any) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", (error: any) => reject(error))
      .on("finish", () => resolve({ path }))
  );
};
