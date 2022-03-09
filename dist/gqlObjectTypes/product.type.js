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
exports.ProductListResponse = exports.ProductOutput = exports.ProductFilters = exports.ProductBulkInput = exports.ProductBulkListInput = exports.ProductInput = void 0;
const graphql_upload_1 = require("graphql-upload");
const Products_1 = require("../models/Products");
const type_graphql_1 = require("type-graphql");
const Vendor_1 = require("../models/Vendor");
let ProductInput = class ProductInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProductInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProductInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProductInput.prototype, "offerPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductInput.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductInput.prototype, "productCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProductInput.prototype, "productSubCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], ProductInput.prototype, "image", void 0);
ProductInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Product data" })
], ProductInput);
exports.ProductInput = ProductInput;
let ProductBulkListInput = class ProductBulkListInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductBulkListInput.prototype, "catalogId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProductBulkListInput.prototype, "pageNo", void 0);
ProductBulkListInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "Product Bulk data" })
], ProductBulkListInput);
exports.ProductBulkListInput = ProductBulkListInput;
let ProductBulkInput = class ProductBulkInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductBulkInput.prototype, "catalogId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProductBulkInput.prototype, "pageNo", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductBulkInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProductBulkInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProductBulkInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProductBulkInput.prototype, "offerPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductBulkInput.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductBulkInput.prototype, "productCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProductBulkInput.prototype, "productSubCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], ProductBulkInput.prototype, "image", void 0);
ProductBulkInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "Product Bulk data" })
], ProductBulkInput);
exports.ProductBulkInput = ProductBulkInput;
let ProductFilters = class ProductFilters {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProductFilters.prototype, "productSubCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProductFilters.prototype, "productCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProductFilters.prototype, "search", void 0);
ProductFilters = __decorate([
    (0, type_graphql_1.InputType)({ description: "Product Filters" })
], ProductFilters);
exports.ProductFilters = ProductFilters;
let ProductOutput = class ProductOutput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductOutput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductOutput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Vendor_1.Vendor),
    __metadata("design:type", Vendor_1.Vendor)
], ProductOutput.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductOutput.prototype, "productCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductOutput.prototype, "productSubCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductOutput.prototype, "image", void 0);
ProductOutput = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "New Product data" })
], ProductOutput);
exports.ProductOutput = ProductOutput;
let ProductListResponse = class ProductListResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductListResponse.prototype, "subcategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductListResponse.prototype, "subcategory", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Products_1.Product]),
    __metadata("design:type", Array)
], ProductListResponse.prototype, "products", void 0);
ProductListResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProductListResponse);
exports.ProductListResponse = ProductListResponse;
//# sourceMappingURL=product.type.js.map