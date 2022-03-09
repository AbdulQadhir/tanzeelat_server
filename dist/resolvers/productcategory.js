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
exports.ProductCatagoriesResolver = void 0;
require("reflect-metadata");
const productcategories_types_1 = require("../gqlObjectTypes/productcategories.types");
const type_graphql_1 = require("type-graphql");
const ProductCategories_1 = __importStar(require("../models/ProductCategories"));
const ProductSubCategory_1 = __importDefault(require("../models/ProductSubCategory"));
const path = require("path");
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';
const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');
const uuid_1 = require("uuid");
let ProductCatagoriesResolver = class ProductCatagoriesResolver {
    async productCategories() {
        const cats = await ProductCategories_1.default.find();
        console.log(cats);
        return cats;
    }
    async productCategoriesDt(search) {
        const cats = await ProductCategories_1.default.aggregate([
            {
                $lookup: {
                    from: 'productsubcategories',
                    localField: '_id',
                    foreignField: 'productCategoryId',
                    as: 'subcategories'
                }
            },
            {
                $match: {
                    $or: [
                        { "name": { "$regex": search, "$options": "i" } },
                        { "namear": { "$regex": search, "$options": "i" } },
                        { "subcategories.name": { "$regex": search, "$options": "i" } },
                        { "subcategories.namear": { "$regex": search, "$options": "i" } }
                    ]
                }
            }
        ]);
        return cats;
    }
    async productCategoryList() {
        const cats = await ProductSubCategory_1.default.aggregate([
            {
                $group: {
                    _id: "$productCategoryId",
                    productCategoryId: {
                        $first: "$productCategoryId"
                    },
                    subCategories: {
                        "$push": { name: "$name", namear: "$namear", id: "$_id" }
                    }
                }
            }
        ]);
        const res = await ProductSubCategory_1.default.populate(cats, { path: "productCategoryId" });
        return res;
    }
    async addProductCategory(input) {
        let image = "";
        console.log(input);
        if (input.image) {
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET
            });
            const { createReadStream, filename, mimetype } = await input.image;
            const { Location } = await s3.upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype
            }).promise();
            console.log(Location);
            image = Location;
        }
        const user = new ProductCategories_1.default({
            name: input.name,
            namear: input.namear,
            image
        });
        const result = await user.save();
        return result;
    }
    async updProductCategory(input, id) {
        let replace = {};
        replace = {
            $set: {
                name: input.name,
                namear: input.namear,
            }
        };
        if (input.image) {
            const user = await ProductCategories_1.default.findById(id);
            const s3 = new AWS.S3({
                accessKeyId: ID,
                secretAccessKey: SECRET
            });
            const { createReadStream, filename, mimetype } = await input.image;
            const { Location } = await s3.upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype
            }).promise();
            if (user.image)
                try {
                    await s3.deleteObject({
                        Bucket: BUCKET_NAME,
                        Key: user.image.split('/').pop()
                    }).promise();
                    console.log("file deleted Successfully");
                }
                catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err));
                }
            console.log(Location);
            replace.$set["image"] = Location;
        }
        const result = await ProductCategories_1.default.findByIdAndUpdate(id, replace);
        return result;
    }
    async productCategoryDt(id) {
        const ProductCategory = await ProductCategories_1.default.findById(id);
        return ProductCategory;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ProductCategories_1.ProductCategories]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductCatagoriesResolver.prototype, "productCategories", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ProductCategories_1.ProductCategories]),
    __param(0, (0, type_graphql_1.Arg)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductCatagoriesResolver.prototype, "productCategoriesDt", null);
__decorate([
    (0, type_graphql_1.Query)(() => [productcategories_types_1.ProductCategoryListOutput]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductCatagoriesResolver.prototype, "productCategoryList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductCategories_1.ProductCategories),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [productcategories_types_1.ProductCategoryInput]),
    __metadata("design:returntype", Promise)
], ProductCatagoriesResolver.prototype, "addProductCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductCategories_1.ProductCategories),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [productcategories_types_1.ProductCategoryInput, String]),
    __metadata("design:returntype", Promise)
], ProductCatagoriesResolver.prototype, "updProductCategory", null);
__decorate([
    (0, type_graphql_1.Query)(() => ProductCategories_1.ProductCategories),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductCatagoriesResolver.prototype, "productCategoryDt", null);
ProductCatagoriesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProductCatagoriesResolver);
exports.ProductCatagoriesResolver = ProductCatagoriesResolver;
//# sourceMappingURL=productcategory.js.map