import "reflect-metadata";
import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import HelpModel, { Help } from "../models/Help";
import { HelpInput } from "../gqlObjectTypes/help.type";
import { Context } from "vm";
import { AZURE_CONTAINER } from "../constants/azure";
import { azureUpload } from "../utils/azure";

const path = require("path");

const fs = require("fs");
const jwt = require("jsonwebtoken");

@Resolver()
export class HelpResolver {
  @Query(() => [Help])
  async helps(@Ctx() ctx: Context): Promise<Help[] | null> {
    console.log(ctx);

    if (ctx.userType != "SUPERADMIN") return null;

    const helps = await HelpModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
    ]);

    return helps;
  }

  @Mutation(() => Help)
  async addHelp(
    @Arg("input", () => HelpInput) input: HelpInput,
    @Ctx() ctx: Context
  ): Promise<Help> {
    let userId = "";

    var publicKEY = fs.readFileSync("src/keys/public.key", "utf8");
    try {
      var decoded = jwt.verify(input.token, publicKEY);
      if (decoded?.userId) userId = decoded.userId;
    } catch (err) {
      // console.log("err",err)
    }

    let images = [];

    let i = 0;
    for (const image of input?.images) {
      if (image) {
        const { createReadStream, filename } = await image;

        const fileStream = createReadStream();
        let streamSize = parseInt(ctx.content_length);

        const Location = await azureUpload(
          `${uuidv4()}${path.extname(filename)}`,
          fileStream,
          streamSize,
          AZURE_CONTAINER.MISC
        );

        console.log(Location);
        images[i] = Location;
      }
      i++;
    }

    const help = new HelpModel({
      userId,
      subject: input.subject,
      description: input.description,
      images,
    });

    await help.save();

    return help;
  }
}
