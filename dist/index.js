"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const vendor_1 = require("./resolvers/vendor");
const catalogcategories_1 = require("./resolvers/catalogcategories");
const vendoroutlet_1 = require("./resolvers/vendoroutlet");
const catalog_1 = require("./resolvers/catalog");
const coupon_1 = require("./resolvers/coupon");
const couponcategories_1 = require("./resolvers/couponcategories");
const catalogview_1 = require("./resolvers/catalogview");
const usercoupon_1 = require("./resolvers/usercoupon");
const graphql_upload_1 = require("graphql-upload");
const productcategory_1 = require("./resolvers/productcategory");
const productsubcategory_1 = require("./resolvers/productsubcategory");
const product_1 = require("./resolvers/product");
const newsfeed_1 = require("./resolvers/newsfeed");
const couponsubcategory_1 = require("./resolvers/couponsubcategory");
const warrantycard_1 = require("./resolvers/warrantycard");
const agent_1 = require("./resolvers/agent");
const superadmin_1 = require("./resolvers/superadmin");
const auth_1 = require("./resolvers/auth");
const vendoruser_1 = require("./resolvers/vendoruser");
const help_1 = require("./resolvers/help");
const logs_1 = require("./resolvers/logs");
const notification_1 = require("./resolvers/notification");
const analytics_1 = require("./resolvers/analytics");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var cors = require("cors");
const startServer = async () => {
    const app = (0, express_1.default)();
    const server = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [
                user_1.UserResolver,
                vendor_1.VendorResolver,
                catalogcategories_1.CatalogCatagoriesResolver,
                vendoroutlet_1.VendorOutletResolver,
                catalog_1.CatalogResolver,
                coupon_1.CouponResolver,
                couponcategories_1.CouponCatagoriesResolver,
                couponsubcategory_1.CouponSubCatagoriesResolver,
                catalogview_1.CatalogViewResolver,
                usercoupon_1.UserCouponResolver,
                productcategory_1.ProductCatagoriesResolver,
                productsubcategory_1.ProductSubCatagoriesResolver,
                product_1.ProductResolver,
                newsfeed_1.NewsFeedResolver,
                warrantycard_1.WarrantyCardResolver,
                agent_1.AgentResolver,
                superadmin_1.SuperAdminResolver,
                auth_1.AuthResolver,
                vendoruser_1.VendorUserResolver,
                help_1.HelpResolver,
                logs_1.LogResolver,
                notification_1.NotificationResolver,
                analytics_1.AnalyticsResolver,
            ],
        }),
        uploads: false,
        context: ({ req }) => {
            var _a;
            let token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
            if (token) {
                if (token.length > 7) {
                    token = token.substr(7);
                    var publicKEY = fs.readFileSync("src/keys/public.key", "utf8");
                    try {
                        var decoded = jwt.verify(token, publicKEY, {
                            ignoreExpiration: true,
                        });
                        if (decoded === null || decoded === void 0 ? void 0 : decoded.userId)
                            return {
                                userId: decoded.userId,
                                roles: decoded.roles || [],
                                userType: decoded.userType,
                            };
                    }
                    catch (err) {
                        console.log("err0", err);
                    }
                }
            }
            return {
                content_length: req.headers["content-length"],
            };
        },
    });
    app.use((0, graphql_upload_1.graphqlUploadExpress)({ maxFiles: 30 }));
    app.use(cors());
    server.applyMiddleware({ app });
    await mongoose_1.default.connect("mongodb+srv://ncod:ncod@cluster0.5eqrd.mongodb.net/tanzeelat?authSource=admin&replicaSet=atlas-249yja-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true");
    app.listen({ port: process.env.PORT || 8080 }, () => console.log(` Server ready`));
};
startServer();
//# sourceMappingURL=index.js.map