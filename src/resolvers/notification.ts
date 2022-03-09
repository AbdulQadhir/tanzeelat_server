import "reflect-metadata";
import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import * as OneSignal from "onesignal-node";
import { NotificationInput } from "../gqlObjectTypes/notification.types";
import { v4 as uuidv4 } from "uuid";
import NotificationModel from "../models/Notification";
import { Notification } from "../models/Notification";
import UserModel from "../models/User";
import { Context } from "vm";

const path = require("path");

const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";

const BUCKET_NAME = "tanzeelat";
const AWS = require("aws-sdk");

@Resolver()
export class NotificationResolver {
  @Query(() => [Notification])
  async getUserNotifications(@Ctx() ctx: Context): Promise<Notification[]> {
    const userId = ctx.userId;
    return NotificationModel.find({ users: userId });
  }

  @Mutation(() => Boolean)
  async delNotification(
    @Arg("id") id: String,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    const userId = ctx.userId;
    await NotificationModel.updateOne(
      { _id: id },
      { $pull: { users: userId } }
    );
    return true;
  }

  @Mutation(() => Boolean)
  async sendNotification(
    @Arg("input") input: NotificationInput
  ): Promise<Boolean> {
    const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: SECRET,
    });

    let image = "";

    if (input.image) {
      const { createReadStream, filename, mimetype } = await input.image;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      console.log(Location);
      image = Location;
    }

    const client = new OneSignal.Client(
      "8010025e-cf62-4172-a3d1-5753bdb00d58",
      "Mzg1MzQ4NTEtZjkzYi00ZTQ1LWJjNzgtYWE2ZWEyZDhlNGY0"
    );
    const notification = {
      headings: {
        ar: input.title,
        en: input.titlear,
      },
      contents: {
        ar: input.title,
        en: input.titlear,
      },
      data: {
        description: input.description,
        descriptionar: input.descriptionar,
        image: image,
        type: "general",
      },
      included_segments: ["Active Users"],
      // include_player_ids: ["6020994a-b4bd-460b-8994-b5d0de76e494"]
    };

    try {
      const response = await client.createNotification(notification);
      console.log(response.body);
    } catch (e) {
      if (e instanceof OneSignal.HTTPError) {
        // When status code of HTTP response is not 2xx, HTTPError is thrown.
        console.log(e.statusCode);
        console.log(e.body);
      }
    }

    return true;
  }

  @Mutation(() => Boolean)
  async sendUserNotification(
    @Arg("input") input: NotificationInput
  ): Promise<Boolean> {
    const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: SECRET,
    });

    let image = "";

    if (input.image) {
      const { createReadStream, filename, mimetype } = await input.image;

      const { Location } = await s3
        .upload({
          // (C)
          Bucket: BUCKET_NAME,
          Body: createReadStream(),
          Key: `${uuidv4()}${path.extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      console.log(Location);
      image = Location;
    }

    const users = await UserModel.find(
      { playerId: { $exists: true } },
      { playerId: 1 }
    );
    const playerIds = users.map((el: { playerId: any }) => el.playerId);
    const userIds = users.map((el: { _id: any }) => el._id);

    const _notification = new NotificationModel({
      title: input.title,
      titlear: input.titlear,
      description: input.description,
      descriptionar: input.descriptionar,
      image,
      users: userIds,
    });
    try {
      await _notification.save();
    } catch (ex) {
      console.log(ex);
    }

    const client = new OneSignal.Client(
      "8010025e-cf62-4172-a3d1-5753bdb00d58",
      "Mzg1MzQ4NTEtZjkzYi00ZTQ1LWJjNzgtYWE2ZWEyZDhlNGY0"
    );
    const notification = {
      headings: {
        ar: input.title,
        en: input.titlear,
      },
      contents: {
        ar: input.title,
        en: input.titlear,
      },
      data: {
        description: input.description,
        descriptionar: input.descriptionar,
        image: image,
        type: "specific",
      },
      include_player_ids: playerIds,
    };

    try {
      const response = await client.createNotification(notification);
      console.log(response.body);
    } catch (e) {
      if (e instanceof OneSignal.HTTPError) {
        // When status code of HTTP response is not 2xx, HTTPError is thrown.
        console.log(e.statusCode);
        console.log(e.body);
      }
    }

    return true;
  }
}
