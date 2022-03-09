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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSubCategoryInput = exports.ProductCategoryListOutput = exports.ProductCategoryInput = void 0;
const ProductSubCategory_1 = require("../models/ProductSubCategory");
const type_graphql_1 = require("type-graphql");
const ProductCategories_1 = require("../models/ProductCategories");
const graphql_upload_1 = require("graphql-upload");
let ProductCategoryInput = class ProductCategoryInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductCategoryInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductCategoryInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], ProductCategoryInput.prototype, "image", void 0);
ProductCategoryInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Product Category data" })
], ProductCategoryInput);
exports.ProductCategoryInput = ProductCategoryInput;
let ProductCategoryListOutput = class ProductCategoryListOutput {
};
__decorate([
    (0, type_graphql_1.Field)(() => ProductCategories_1.ProductCategories),
    __metadata("design:type", ProductCategories_1.ProductCategories)
], ProductCategoryListOutput.prototype, "productCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductSubCategory_1.ProductSubCategories], { nullable: true }),
    __metadata("design:type", Array)
], ProductCategoryListOutput.prototype, "subCategories", void 0);
ProductCategoryListOutput = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "Product Category data" })
], ProductCategoryListOutput);
exports.ProductCategoryListOutput = ProductCategoryListOutput;
let ProductSubCategoryInput = class ProductSubCategoryInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductSubCategoryInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductSubCategoryInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], ProductSubCategoryInput.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductSubCategoryInput.prototype, "productCategoryId", void 0);
ProductSubCategoryInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Product Sub Category data" })
], ProductSubCategoryInput);
exports.ProductSubCategoryInput = ProductSubCategoryInput;
//# sourceMappingURL=productcategories.types.js.map