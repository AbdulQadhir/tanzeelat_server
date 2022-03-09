import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
// import { Context } from "vm";
import VendorUserModel, { VendorUser } from "../models/VendorUser";
import { AddVendorUserInput } from "../gqlObjectTypes/vendoruser.types";
import Mongoose from "mongoose";

@Resolver()
export class VendorUserResolver {
  @Query(() => [VendorUser])
  async vendorUsers(
    // @Ctx() ctx: Context
    @Arg("vendorId") vendorId: string
  ): Promise<VendorUser[]> {
    const users = await VendorUserModel.find(
      { vendorId: vendorId, active: true },
      "username"
    );
    return users;
  }

  @Query(() => VendorUser)
  async vendorUserDt(@Arg("id") id: string): Promise<VendorUser> {
    const users = await VendorUserModel.aggregate([
      {
        $match: {
          _id: new Mongoose.Types.ObjectId(id),
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
    return users?.length > 0 && users[0];
  }

  @Mutation(() => VendorUser)
  async updateVendorUser(
    @Arg("input") input: AddVendorUserInput,
    @Arg("id") id: String
  ): Promise<VendorUser> {
    let replace: any = {};
    replace = {
      $set: {
        username: input.username,
        password: input.password,
        outlets: input.outlets,
      },
    };

    const result = await VendorUserModel.findByIdAndUpdate(id, replace);
    return result;
  }

  @Mutation(() => VendorUser)
  async addVendorUser(
    @Arg("input") input: AddVendorUserInput
  ): Promise<VendorUser> {
    const user = new VendorUserModel({ ...input });
    const result = await user.save();
    return result;
  }

  @Mutation(() => Boolean)
  async delVendorUser(@Arg("id") id: String): Promise<Boolean> {
    await VendorUserModel.findByIdAndUpdate(id, { active: false });
    return true;
  }
}
