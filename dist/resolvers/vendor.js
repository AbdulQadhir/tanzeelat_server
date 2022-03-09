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
exports.VendorResolver = void 0;
require("reflect-metadata");
const vendor_types_1 = require("../gqlObjectTypes/vendor.types");
const type_graphql_1 = require("type-graphql");
const Vendor_1 = __importStar(require("../models/Vendor"));
const uuid_1 = require("uuid");
const Catalog_1 = __importDefault(require("../models/Catalog"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const auth_1 = require("./auth");
const VendorOutlet_1 = __importDefault(require("../models/VendorOutlet"));
const mongoose_1 = require("mongoose");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";
const BUCKET_NAME = "tanzeelat";
const AWS = require("aws-sdk");
let VendorResolver = class VendorResolver {
    async vendors(ctx) {
        console.log(ctx.userId);
        const accessList = await (0, auth_1.accessibleVendorList)(ctx.userId);
        if (accessList.length == 0)
            return [];
        if (accessList[0] == "all")
            return await Vendor_1.default.find({ active: true });
        else {
            const _accessList = accessList === null || accessList === void 0 ? void 0 : accessList.map((id) => new mongoose_1.Types.ObjectId(id));
            const res = await Vendor_1.default.find({
                $and: [{ _id: { $in: _accessList } }, { active: true }],
            });
            return res;
        }
    }
    async allVendors() {
        return await Vendor_1.default.find({ active: true });
    }
    async vendorDt(id, ctx) {
        console.log(id);
        const accessList = await (0, auth_1.accessibleVendorList)(ctx.userId);
        console.log(ctx);
        console.log(accessList);
        if (accessList.length == 0)
            return null;
        if (accessList[0] != "all" &&
            accessList.findIndex((el) => el.toString() == id.toString()) == -1)
            return null;
        const vendor = await Vendor_1.default.findById(id);
        return vendor;
    }
    async vendorDtExtra(id, ctx) {
        const accessList = await (0, auth_1.accessibleVendorList)(ctx.userId);
        if (accessList.length == 0)
            return null;
        if (accessList[0] != "all" &&
            accessList.findIndex((el) => el.toString() == id.toString()) == -1)
            return null;
        const catalogs = await Catalog_1.default.count({ vendorId: id });
        const coupons = await Coupon_1.default.count({ vendorId: id });
        const outlets = await VendorOutlet_1.default.count({ vendorId: id });
        return {
            coupons: coupons || 0,
            catalogs: catalogs || 0,
            outlets: outlets || 0,
        };
    }
    async loginVendor(input) {
        const user = await Vendor_1.default.findOne({ username: input.username });
        if (!user)
            return {
                errors: [{ message: "Invalid User" }],
            };
        const match = (await input.password) == user.password;
        if (match) {
            var privateKEY = fs.readFileSync("src/keys/private.key", "utf8");
            var i = "tanzeelat";
            var s = "tanzeelat";
            var a = "tanzeelat";
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
        }
        else
            return {
                errors: [{ message: "Invalid Login" }],
            };
    }
    async updateVendor(input, id) {
        let replace = {};
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
            const user = await Vendor_1.default.findById(id);
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET,
            });
            const { createReadStream, filename, mimetype } = await input.logo;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err));
                }
            replace.$set["logo"] = Location;
        }
        if (input.shopimage) {
            const user = await Vendor_1.default.findById(id);
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET,
            });
            const { createReadStream, filename, mimetype } = await input.shopimage;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err));
                }
            replace.$set["shopimage"] = Location;
        }
        const result = await Vendor_1.default.findByIdAndUpdate(id, replace);
        return result;
    }
    async registerVendor(input) {
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
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
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
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype,
            })
                .promise();
            shopimg = Location;
        }
        const user = new Vendor_1.default({ ...input, logo: img, shopimage: shopimg });
        const result = await user.save();
        return result;
    }
    async delVendor(id) {
        await Vendor_1.default.findByIdAndUpdate(id, { active: false });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Vendor_1.Vendor]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "vendors", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Vendor_1.Vendor]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "allVendors", null);
__decorate([
    (0, type_graphql_1.Query)(() => Vendor_1.Vendor),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "vendorDt", null);
__decorate([
    (0, type_graphql_1.Query)(() => vendor_types_1.VendorExtra),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "vendorDtExtra", null);
__decorate([
    (0, type_graphql_1.Query)(() => vendor_types_1.VendorLoginResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_types_1.VendorLoginInput]),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "loginVendor", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Vendor_1.Vendor),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_types_1.AddVendorInput,
        String]),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "updateVendor", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Vendor_1.Vendor),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_types_1.AddVendorInput]),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "registerVendor", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorResolver.prototype, "delVendor", null);
VendorResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], VendorResolver);
exports.VendorResolver = VendorResolver;
//# sourceMappingURL=vendor.js.map