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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const product_type_1 = require("../gqlObjectTypes/product.type");
const uuid_1 = require("uuid");
const Products_1 = __importStar(require("../models/Products"));
const mongoose_1 = require("mongoose");
const path = require("path");
const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";
const BUCKET_NAME = "tanzeelat";
const AWS = require("aws-sdk");
let ProductResolver = class ProductResolver {
    async allProducts(filter) {
        console.log(filter);
        const today = new Date();
        const filterCategory = filter.productCategoryId != "0"
            ? {
                productCategoryId: new mongoose_1.Types.ObjectId(filter.productCategoryId),
            }
            : {};
        const products = await Products_1.default.aggregate([
            {
                $match: {
                    ...filterCategory,
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
                $lookup: {
                    from: "catalogs",
                    localField: "catalogId",
                    foreignField: "_id",
                    as: "catalog",
                },
            },
            {
                $unwind: {
                    path: "$catalog",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: filter.search || "", $options: "i" } },
                        {
                            "vendor.shopname": { $regex: filter.search || "", $options: "i" },
                        },
                    ],
                    "catalog.expiry": { $gte: today },
                },
            },
        ]);
        return products;
    }
    async productsByVendor(vendorId) {
        console.log(vendorId);
        return await Products_1.default.aggregate([
            {
                $match: {
                    vendorId: new mongoose_1.Types.ObjectId(vendorId),
                    catalogId: { $exists: false },
                },
            },
            {
                $group: {
                    _id: "$productSubCategoryId",
                    productSubCategoryId: {
                        $first: "$productCategoryId",
                    },
                    products: {
                        $push: {
                            id: "$_id",
                            name: "$name",
                            image: "$image",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "productcategories",
                    localField: "productSubCategoryId",
                    foreignField: "_id",
                    as: "subcategory",
                },
            },
            {
                $unwind: {
                    path: "$subcategory",
                },
            },
            {
                $project: {
                    subcategoryId: "$productSubCategoryId",
                    subcategory: "$subcategory.name",
                    products: 1,
                },
            },
        ]);
    }
    async productsInCatalog(input) {
        return await Products_1.default.aggregate([
            {
                $match: {
                    catalogId: new mongoose_1.Types.ObjectId(input.catalogId),
                    pageNo: input.pageNo,
                },
            },
            {
                $lookup: {
                    from: "productcategories",
                    localField: "productCategoryId",
                    foreignField: "_id",
                    as: "productCategory",
                },
            },
            {
                $unwind: {
                    path: "$productCategory",
                },
            },
        ]);
    }
    async addProduct(input) {
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        let image = "";
        if (input.image) {
            const { createReadStream, filename, mimetype } = await input.image;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype,
            })
                .promise();
            console.log(Location);
            image = Location;
        }
        const product = new Products_1.default({
            name: input.name,
            namear: input.namear,
            price: input.price,
            offerPrice: input.offerPrice,
            vendorId: input.vendorId,
            productCategoryId: input.productCategoryId,
            productSubCategoryId: input.productSubCategoryId,
            image,
        });
        const result = await product.save();
        return result;
    }
    async addProductBulk(input) {
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        let image = "";
        if (input.image) {
            const { createReadStream, filename, mimetype } = await input.image;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype,
            })
                .promise();
            console.log(Location);
            image = Location;
        }
        const product = new Products_1.default({
            name: input.name,
            namear: input.namear,
            price: input.price,
            offerPrice: input.offerPrice,
            vendorId: input.vendorId,
            catalogId: input.catalogId,
            pageNo: input.pageNo,
            productCategoryId: input.productCategoryId,
            productSubCategoryId: input.productSubCategoryId,
            image,
        });
        const result = await product.save();
        return result;
    }
    async delProduct(id) {
        const product = await Products_1.default.findById(id);
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        if (product.image)
            try {
                await s3
                    .deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: product.image.split("/").pop(),
                })
                    .promise();
                console.log("file deleted Successfully");
            }
            catch (err) {
                console.log("ERROR in file Deleting : " + JSON.stringify(err));
            }
        await Products_1.default.findByIdAndDelete(id);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Products_1.Product]),
    __param(0, (0, type_graphql_1.Arg)("filter")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_type_1.ProductFilters]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "allProducts", null);
__decorate([
    (0, type_graphql_1.Query)(() => [product_type_1.ProductListResponse]),
    __param(0, (0, type_graphql_1.Arg)("vendorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "productsByVendor", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Products_1.Product]),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_type_1.ProductBulkListInput]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "productsInCatalog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Products_1.Product),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_type_1.ProductInput]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "addProduct", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Products_1.Product),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_type_1.ProductBulkInput]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "addProductBulk", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "delProduct", null);
ProductResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProductResolver);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=product.js.map