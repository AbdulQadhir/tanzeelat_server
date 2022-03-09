"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.CouponResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const Coupon_1 = __importStar(require("../models/Coupon"));
const coupon_type_1 = require("..//gqlObjectTypes/coupon.type");
const mongoose_1 = require("mongoose");
const UserCoupon_1 = __importDefault(require("../models/UserCoupon"));
const uuid_1 = require("uuid");
const VendorOutlet_1 = __importDefault(require("../models/VendorOutlet"));
const Geo_1 = __importDefault(require("../utils/Geo"));
const VendorUser_1 = __importDefault(require("../models/VendorUser"));
const path = require("path");
const AWS = require("aws-sdk");
const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";
const BUCKET_NAME = "tanzeelat";
let CouponResolver = class CouponResolver {
    async couponsWithFilter(filter) {
        console.log(filter);
        const today = new Date();
        const filterState = filter.state != ""
            ? {
                state: filter.state,
            }
            : {};
        const filterCategory = filter.id != "0"
            ? {
                "coupon.couponCategoryId": new mongoose_1.Types.ObjectId(filter.id),
            }
            : {};
        const filterSearch = filter.search != ""
            ? {
                $or: [
                    { "vendor.shopname": { $regex: filter.search, $options: "i" } },
                    { "coupon.name": { $regex: filter.search, $options: "i" } },
                ],
            }
            : {};
        const filterDistance = filter.coordinates
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
        ];
        if (filter.coordinates)
            aggregation = [filterDistance, ...aggregation];
        const coupons = await VendorOutlet_1.default.aggregate(aggregation);
        return coupons;
    }
    async otherCouponsOfVendor(couponId) {
        const coupon = await Coupon_1.default.findById(couponId);
        const vendorId = coupon.vendorId;
        const today = new Date();
        const coupons = await Coupon_1.default.aggregate([
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
                    vendorId: new mongoose_1.Types.ObjectId(vendorId),
                    _id: { $ne: new mongoose_1.Types.ObjectId(couponId) },
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
    async coupons(vendorId, subCategoryId, ctx) {
        const userId = ctx.userId || "";
        const coupons = await UserCoupon_1.default.aggregate([
            {
                $match: {
                    userId: new mongoose_1.Types.ObjectId(userId),
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
                    "coupons.couponSubCategoryId": new mongoose_1.Types.ObjectId(subCategoryId),
                    "coupons.vendorId": new mongoose_1.Types.ObjectId(vendorId),
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
    async couponsOfVendor(vendorId) {
        const coupons = await Coupon_1.default.find({ vendorId });
        return coupons;
    }
    async couponsOfVendorForApp(ctx) {
        const user = await VendorUser_1.default.findById(ctx.userId);
        const coupons = await Coupon_1.default.find({ vendorId: user.vendorId }, "_id name description endDate").sort({ createdAt: -1 });
        return coupons;
    }
    async couponFullDt(id, coordinates) {
        var _a;
        let coupons = await Coupon_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(id),
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
            const tmp = coupons.length > 0 &&
                ((_a = coupons[0].outletsDt) === null || _a === void 0 ? void 0 : _a.map((outlet) => {
                    var _a;
                    return {
                        ...outlet,
                        distance: (0, Geo_1.default)(userLoc, ((_a = outlet === null || outlet === void 0 ? void 0 : outlet.location) === null || _a === void 0 ? void 0 : _a.coordinates) || [0, 0]),
                    };
                }));
            let cpn = coupons.length > 0 && coupons[0];
            cpn.outletsDt = tmp;
            return cpn;
        }
        else
            return coupons.length > 0 && coupons[0];
    }
    async couponDt(id) {
        const coupons = await Coupon_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(id),
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
    async couponSummary(id) {
        const sent = await Coupon_1.default.findById(id);
        const redeemed = await UserCoupon_1.default.count({ couponId: id });
        return {
            sent: (sent === null || sent === void 0 ? void 0 : sent.redeemLimit) || 0,
            redeemed: redeemed || 0,
        };
    }
    async addCoupon(input) {
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
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype,
            })
                .promise();
            thumbnailAr = Location;
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        const coupon = new Coupon_1.default({
            ...input,
            menu,
            thumbnail,
            thumbnailAr,
            code,
        });
        const result = await coupon.save();
        return result;
    }
    async updateCoupon(input, id) {
        console.log(input.menu);
        let replace = {};
        replace = {
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
            const user = await Coupon_1.default.findById(id);
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET,
            });
            const { createReadStream, filename, mimetype } = await input.menu;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err));
                }
            console.log(Location);
            replace.$set["menu"] = Location;
        }
        if (input.thumbnail) {
            const user = await Coupon_1.default.findById(id);
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET,
            });
            const { createReadStream, filename, mimetype } = await input.thumbnail;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err));
                }
            console.log(Location);
            replace.$set["thumbnail"] = Location;
        }
        if (input.thumbnailAr) {
            const user = await Coupon_1.default.findById(id);
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET,
            });
            const { createReadStream, filename, mimetype } = await input.thumbnailAr;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err));
                }
            console.log(Location);
            replace.$set["thumbnailAr"] = Location;
        }
        const result = await Coupon_1.default.findByIdAndUpdate(id, replace);
        return result;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [coupon_type_1.CouponFilterOutput]),
    __param(0, (0, type_graphql_1.Arg)("filter")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_type_1.CouponFilterInput]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "couponsWithFilter", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Coupon_1.Coupon]),
    __param(0, (0, type_graphql_1.Arg)("couponId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "otherCouponsOfVendor", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Coupon_1.Coupon]),
    __param(0, (0, type_graphql_1.Arg)("vendorId")),
    __param(1, (0, type_graphql_1.Arg)("subCategoryId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "coupons", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Coupon_1.Coupon]),
    __param(0, (0, type_graphql_1.Arg)("vendorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "couponsOfVendor", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Coupon_1.Coupon]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "couponsOfVendorForApp", null);
__decorate([
    (0, type_graphql_1.Query)(() => Coupon_1.Coupon),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("coordinates")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "couponFullDt", null);
__decorate([
    (0, type_graphql_1.Query)(() => Coupon_1.Coupon),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "couponDt", null);
__decorate([
    (0, type_graphql_1.Query)(() => coupon_type_1.CouponSummary),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "couponSummary", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Coupon_1.Coupon),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_type_1.CouponInput]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "addCoupon", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Coupon_1.Coupon),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_type_1.CouponInput, String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "updateCoupon", null);
CouponResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CouponResolver);
exports.CouponResolver = CouponResolver;
//# sourceMappingURL=coupon.js.map