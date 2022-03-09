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
exports.ProductSubCatagoriesResolver = void 0;
require("reflect-metadata");
const productcategories_types_1 = require("../gqlObjectTypes/productcategories.types");
const type_graphql_1 = require("type-graphql");
const ProductSubCategory_1 = __importStar(require("../models/ProductSubCategory"));
const path = require("path");
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';
const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');
const uuid_1 = require("uuid");
let ProductSubCatagoriesResolver = class ProductSubCatagoriesResolver {
    async productSubCategories(id) {
        const cats = await ProductSubCategory_1.default.find({ productCategoryId: id });
        return cats;
    }
    async addProductSubCategory(input) {
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
        const user = new ProductSubCategory_1.default({
            name: input.name,
            namear: input.namear,
            productCategoryId: input.productCategoryId,
            image
        });
        const result = await user.save();
        return result;
    }
    async updProductSubCategory(input, id) {
        let replace = {};
        replace = {
            $set: {
                name: input.name,
                namear: input.namear,
                productCategoryId: input.productCategoryId
            }
        };
        if (input.image) {
            const user = await ProductSubCategory_1.default.findById(id);
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
        const result = await ProductSubCategory_1.default.findByIdAndUpdate(id, replace);
        return result;
    }
    async productSubCategoryDt(id) {
        const ProductSubCategory = await ProductSubCategory_1.default.findById(id);
        return ProductSubCategory;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ProductSubCategory_1.ProductSubCategories]),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductSubCatagoriesResolver.prototype, "productSubCategories", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductSubCategory_1.ProductSubCategories),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [productcategories_types_1.ProductSubCategoryInput]),
    __metadata("design:returntype", Promise)
], ProductSubCatagoriesResolver.prototype, "addProductSubCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductSubCategory_1.ProductSubCategories),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [productcategories_types_1.ProductSubCategoryInput, String]),
    __metadata("design:returntype", Promise)
], ProductSubCatagoriesResolver.prototype, "updProductSubCategory", null);
__decorate([
    (0, type_graphql_1.Query)(() => ProductSubCategory_1.ProductSubCategories),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductSubCatagoriesResolver.prototype, "productSubCategoryDt", null);
ProductSubCatagoriesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProductSubCatagoriesResolver);
exports.ProductSubCatagoriesResolver = ProductSubCatagoriesResolver;
//# sourceMappingURL=productsubcategory.js.map