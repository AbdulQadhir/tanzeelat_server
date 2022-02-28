import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { VendorResolver } from "./resolvers/vendor";
import { CatalogCatagoriesResolver } from "./resolvers/catalogcategories";
import { VendorOutletResolver } from "./resolvers/vendoroutlet";
import { CatalogResolver } from "./resolvers/catalog";
import { CouponResolver } from "./resolvers/coupon";
import { CouponCatagoriesResolver } from "./resolvers/couponcategories";
import { CatalogViewResolver } from "./resolvers/catalogview";
import { UserCouponResolver } from "./resolvers/usercoupon";

import { graphqlUploadExpress } from "graphql-upload";
import { ProductCatagoriesResolver } from "./resolvers/productcategory";
import { ProductSubCatagoriesResolver } from "./resolvers/productsubcategory";
import { ProductResolver } from "./resolvers/product";
import { NewsFeedResolver } from "./resolvers/newsfeed";
import { CouponSubCatagoriesResolver } from "./resolvers/couponsubcategory";
import { WarrantyCardResolver } from "./resolvers/warrantycard";
import { AgentResolver } from "./resolvers/agent";
import { SuperAdminResolver } from "./resolvers/superadmin";
import { AuthResolver } from "./resolvers/auth";
import { VendorUserResolver } from "./resolvers/vendoruser";
import { HelpResolver } from "./resolvers/help";
import { LogResolver } from "./resolvers/logs";
import { NotificationResolver } from "./resolvers/notification";
import { AnalyticsResolver } from "./resolvers/analytics";

const fs = require("fs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

var cors = require("cors");

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        VendorResolver,
        CatalogCatagoriesResolver,
        VendorOutletResolver,
        CatalogResolver,
        CouponResolver,
        CouponCatagoriesResolver,
        CouponSubCatagoriesResolver,
        CatalogViewResolver,
        UserCouponResolver,
        ProductCatagoriesResolver,
        ProductSubCatagoriesResolver,
        ProductResolver,
        NewsFeedResolver,
        WarrantyCardResolver,
        AgentResolver,
        SuperAdminResolver,
        AuthResolver,
        VendorUserResolver,
        HelpResolver,
        LogResolver,
        NotificationResolver,
        AnalyticsResolver,
      ],
    }),
    uploads: false,
    context: ({ req }) => {
      let token = req.headers?.authorization;

      if (token) {
        if (token.length > 7) {
          token = token.substr(7);
          var publicKEY = fs.readFileSync("src/keys/public.key", "utf8");
          try {
            var decoded = jwt.verify(token, publicKEY, {
              ignoreExpiration: true,
            });
            if (decoded?.userId)
              return {
                userId: decoded.userId,
                roles: decoded.roles || [],
                userType: decoded.userType,
              };
            //console.log("decoded",decoded?.userId);
          } catch (err) {
            console.log("err0", err);
          }
        }
      }
      return {
        content_length: req.headers["content-length"],
      };
    },
  });

  app.use(graphqlUploadExpress({ maxFiles: 30 }));
  app.use(cors());

  server.applyMiddleware({ app });

  //await mongoose.connect('mongodb://localhost:27017/tanzeelat', {useNewUrlParser: true, useUnifiedTopology: true});
  await mongoose.connect(
    "mongodb+srv://ncod:ncod@cluster0.5eqrd.mongodb.net/tanzeelat?authSource=admin&replicaSet=atlas-249yja-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  app.listen({ port: process.env.PORT }, () => console.log(` Server ready`));
};

startServer();
