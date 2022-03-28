import "reflect-metadata";
import { Resolver, Arg, Mutation, Ctx } from "type-graphql";
import { Types } from "mongoose";
import CatalogPriorityModel from "../models/CatalogPriority";
import CatalogCategoriesModel from "../models/CatalogCategories";
import { Context } from "@apollo/client";

@Resolver()
export class CatalogPriorityResolver {
  @Mutation(() => Boolean)
  async setCatalogPriority(
    @Arg("catalogId") catalogId: string,
    @Arg("rank") rank: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const _rank = parseInt(rank) || 0;
    const vendorId = ctx.userId;

    if (_rank > 0) {
      await CatalogPriorityModel.deleteOne({
        catalogId: new Types.ObjectId(catalogId),
        vendorId: new Types.ObjectId(vendorId),
      });

      await CatalogPriorityModel.updateMany(
        {
          vendorId: new Types.ObjectId(vendorId),
          rank: { $gte: _rank },
        },
        {
          $inc: {
            rank: 1,
          },
        }
      );

      const _ = new CatalogPriorityModel({
        catalogId,
        vendorId,
        rank: _rank,
      });
      await _.save();
    } else {
      await CatalogPriorityModel.deleteOne({
        catalogId: new Types.ObjectId(catalogId),
        vendorId: new Types.ObjectId(vendorId),
      });

      await CatalogPriorityModel.updateMany(
        {
          vendorId: new Types.ObjectId(vendorId),
          rank: { $gte: rank },
        },
        {
          $inc: {
            rank: -1,
          },
        }
      );
    }

    return true;
  }

  @Mutation(() => Boolean)
  async unsetCatalogPriority(
    @Arg("catalogId") catalogId: string,
    @Arg("vendorId") vendorId: string,
    @Arg("rank") rank: number
  ): Promise<boolean> {
    await CatalogPriorityModel.deleteOne({
      catalogId: new Types.ObjectId(catalogId),
      vendorId: new Types.ObjectId(vendorId),
      rank: { $gte: rank },
    });

    await CatalogPriorityModel.updateMany(
      {
        catalogId: new Types.ObjectId(catalogId),
        vendorId: new Types.ObjectId(vendorId),
        rank: { $gte: rank },
      },
      {
        $inc: {
          rank: -1,
        },
      }
    );

    const _ = new CatalogCategoriesModel({
      catalogId,
      vendorId,
      rank,
    });
    await _.save();

    return true;
  }
}
