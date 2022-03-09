"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCouponResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const UserCoupon_1 = __importDefault(require("../models/UserCoupon"));
const coupon_type_1 = require("../gqlObjectTypes/coupon.type");
const mongoose_1 = require("mongoose");
const VendorUser_1 = __importDefault(require("../models/VendorUser"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const VendorOutlet_1 = __importDefault(require("../models/VendorOutlet"));
const fs = require("fs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
let UserCouponResolver = class UserCouponResolver {
    async redeemCoupon(couponString, ctx) {
        if (couponString == "Invalid Coupon")
            return {
                result: false,
                error: "Invalid Coupon",
            };
        const strs = couponString.split(";");
        if (strs.length == 0)
            return {
                result: false,
                error: "Invalid Coupon",
            };
        const couponId = strs[0];
        const custToken = strs[1];
        var userId = "";
        var vendorUserId = ctx.userId;
        var publicKEY = fs.readFileSync("src/keys/public.key", "utf8");
        try {
            var decoded = jwt.verify(custToken, publicKEY, {
                ignoreExpiration: true,
            });
            if (decoded === null || decoded === void 0 ? void 0 : decoded.userId)
                userId = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
        }
        catch (err) {
            console.log("err", err);
        }
        const vendorUser = await VendorUser_1.default.findById(vendorUserId);
        const outletId = vendorUser.outlets[0] || "";
        let state = "";
        if (outletId != "") {
            const outlet = await VendorOutlet_1.default.findById(outletId);
            state = outlet === null || outlet === void 0 ? void 0 : outlet.state;
        }
        const coupon = await Coupon_1.default.findById(couponId);
        if (!coupon)
            return {
                result: false,
                error: "Invalid Coupon",
            };
        if (!coupon.outlets.includes(outletId))
            return {
                result: false,
                error: "Coupon not available here",
            };
        var now = moment();
        if (!now > moment(coupon.expiry))
            return {
                result: false,
                error: "Coupon Expired",
            };
        const exists = await UserCoupon_1.default.countDocuments({
            couponId,
            userId,
        });
        if (exists > 0)
            return {
                result: false,
                error: "This coupon is already redeemed once",
            };
        const redeem = new UserCoupon_1.default({
            couponId,
            userId,
            vendorUserId,
            outletId,
        });
        await redeem.save();
        return {
            result: true,
            details: {
                couponId,
                userId,
                vendorUserId,
                outletId,
                state,
            },
        };
    }
    async unveilUserCoupon(id) {
        const result = await UserCoupon_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "coupons",
                    localField: "couponId",
                    foreignField: "_id",
                    as: "coupon",
                },
            },
            {
                $unwind: {
                    path: "$coupon",
                },
            },
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
            {
                $project: {
                    userId: "$user._id",
                    couponId: "$coupon._id",
                    name: "$user.name",
                    coupon: "$coupon.name",
                    description: "$coupon.description",
                    redeemed: 1,
                },
            },
        ]);
        return (result === null || result === void 0 ? void 0 : result.length) > 0 ? result[0] : null;
    }
    async redeemHistory(ctx, couponId) {
        const history = await UserCoupon_1.default.aggregate([
            {
                $match: {
                    vendorUserId: new mongoose_1.Types.ObjectId(ctx.userId),
                    couponId: new mongoose_1.Types.ObjectId(couponId),
                },
            },
            {
                $lookup: {
                    from: "coupons",
                    localField: "couponId",
                    foreignField: "_id",
                    as: "coupon",
                },
            },
            {
                $unwind: {
                    path: "$coupon",
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    coupon_name: "$coupon.name",
                    createdAt: { $dateToString: { date: "$createdAt" } },
                },
            },
        ]);
        return history;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => coupon_type_1.CouponRedeemOutput),
    __param(0, (0, type_graphql_1.Arg)("couponString")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserCouponResolver.prototype, "redeemCoupon", null);
__decorate([
    (0, type_graphql_1.Query)(() => coupon_type_1.CouponUnveil),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserCouponResolver.prototype, "unveilUserCoupon", null);
__decorate([
    (0, type_graphql_1.Query)(() => [coupon_type_1.HistoryItem]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("couponId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserCouponResolver.prototype, "redeemHistory", null);
UserCouponResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserCouponResolver);
exports.UserCouponResolver = UserCouponResolver;
//# sourceMappingURL=usercoupon.js.map