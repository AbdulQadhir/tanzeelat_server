import "reflect-metadata";
import {
  VendorLoginInput,
  VendorLoginResponse,
  AddVendorInput,
  VendorExtra,
} from "../gqlObjectTypes/vendor.types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import VendorModel, { Vendor } from "../models/Vendor";
import { v4 as uuidv4 } from "uuid";
import CatalogModel from "../models/Catalog";
import CouponModel from "../models/Coupon";
import { accessibleVendorList } from "./auth";
import { Context } from "vm";
import VendorOutletModel from "../models/VendorOutlet";
import { Types } from "mongoose";

//const bcrypt = require('bcrypt');
//const saltRounds = 10;

const fs = require("fs");
const jwt = require("jsonwebtoken");

const path = require("path");

const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";

const BUCKET_NAME = "tanzeelat";
const AWS = require("aws-sdk");

@Resolver()
export class VendorResolver {
  @Query(() => [Vendor])
  async vendors(@Ctx() ctx: Context): Promise<Vendor[]> {
    console.log(ctx.userId);
    const accessList = await accessibleVendorList(ctx.userId);
    if (accessList.length == 0) return [];
    if (accessList[0] == "all") return await VendorModel.find({ active: true });
    else {
      const _accessList = accessList?.map(
        (id: string | number | undefined) => new Types.ObjectId(id)
      );
      const res = await VendorModel.find({
        $and: [{ _id: { $in: _accessList } }, { active: true }],
      });
      return res;
    }
  }

  @Query(() => [Vendor])
  async allVendors(): Promise<Vendor[]> {
    return await VendorModel.find({ active: true });
  }

  @Query(() => Vendor)
  async vendorDt(
    @Arg("id") id: String,
    @Ctx() ctx: Context
  ): Promise<Vendor | null> {
    console.log(id);
    const accessList = await accessibleVendorList(ctx.userId);

    console.log(ctx);
    console.log(accessList);
    if (accessList.length == 0) return null;

    if (
      accessList[0] != "all" &&
      accessList.findIndex(
        (el: { toString: () => string }) => el.toString() == id.toString()
      ) == -1
    )
      return null;

    const vendor = await VendorModel.findById(id);
    return vendor;
  }

  @Query(() => VendorExtra)
  async vendorDtExtra(
    @Arg("id") id: String,
    @Ctx() ctx: Context
  ): Promise<VendorExtra | null> {
    const accessList = await accessibleVendorList(ctx.userId);

    if (accessList.length == 0) return null;

    if (
      accessList[0] != "all" &&
      accessList.findIndex(
        (el: { toString: () => string }) => el.toString() == id.toString()
      ) == -1
    )
      return null;

    const catalogs = await CatalogModel.count({ vendorId: id });
    const coupons = await CouponModel.count({ vendorId: id });
    const outlets = await VendorOutletModel.count({ vendorId: id });
    return {
      coupons: coupons || 0,
      catalogs: catalogs || 0,
      outlets: outlets || 0,
    };
  }

  @Query(() => VendorLoginResponse)
  async loginVendor(
    @Arg("input") input: VendorLoginInput
  ): Promise<VendorLoginResponse> {
    const user = await VendorModel.findOne({ username: input.username });
    if (!user)
      return {
        errors: [{ message: "Invalid User" }],
      };

    const match = (await input.password) == user.password; // await bcrypt.compare(input.password, user.password);
    if (match) {
      var privateKEY = fs.readFileSync("src/keys/private.key", "utf8");
      var i = "tanzeelat"; // Issuer
      var s = "tanzeelat"; // Subject
      var a = "tanzeelat"; // Audience// SIGNING OPTIONS
      var signOptions = {
        issuer: i,
        subject: s,
        audience: a,
        expiresIn: "12h",
        algorithm: "RS256",
      };
      var payload = {
        userId: user._id,
      };
      var token = jwt.sign(payload, privateKEY, signOptions);
      return {
        token,
        name: user.shopname,
      };
    } else
      return {
        errors: [{ message: "Invalid Login" }],
      };
  }

  @Mutation(() => Vendor)
  async updateVendor(
    @Arg("input") input: AddVendorInput,
    @Arg("id") id: String
  ): Promise<Vendor> {
    let replace: any = {};
    replace = {
      $set: {
        shopname: input.shopname,
        namear: input.namear,
        brandname: input.brandname,
        tradelicense: input.tradelicense,
        ownername: input.ownername,
        ownerphone: input.ownerphone,
        owneremail: input.owneremail,
        contactname: input.contactname,
        contactphone: input.contactphone,
        contactmobile: input.contactmobile,
        contactemail: input.contactemail,
        grade: input.grade,
        subtitle: input.subtitle,
        about: input.about,
      },
    };

    if (input.logo) {
      const user = await VendorModel.findById(id);

      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });

      const { createReadStream, filename, mimetype } = await input.logo;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      if (user.logo)
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

      replace.$set["logo"] = Location;
    }
    if (input.shopimage) {
      const user = await VendorModel.findById(id);

      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });

      const { createReadStream, filename, mimetype } = await input.shopimage;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      if (user.shopimage)
        try {
          await s3
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: user.shopimage.split("/").pop(),
            })
            .promise();
          console.log("file deleted Successfully");
        } catch (err) {
          console.log("ERROR in file Deleting : " + JSON.stringify(err));
        }

      replace.$set["shopimage"] = Location;
    }

    const result = await VendorModel.findByIdAndUpdate(id, replace);
    return result;
  }

  @Mutation(() => Vendor)
  async registerVendor(@Arg("input") input: AddVendorInput): Promise<Vendor> {
    let img = "";
    let shopimg = "";

    if (input.logo) {
      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });

      const { createReadStream, filename, mimetype } = await input.logo;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      img = Location;
    }
    if (input.shopimage) {
      const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
      });

      const { createReadStream, filename, mimetype } = await input.shopimage;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      shopimg = Location;
    }

    const user = new VendorModel({ ...input, logo: img, shopimage: shopimg });

    const result = await user.save();

    return result;
  }

  @Mutation(() => Boolean)
  async delVendor(@Arg("id") id: String): Promise<Boolean> {
    await VendorModel.findByIdAndUpdate(id, { active: false });
    return true;
  }
}
