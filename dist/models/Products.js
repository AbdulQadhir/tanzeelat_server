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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importStar(require("mongoose"));
const Vendor_1 = require("./Vendor");
const ProductCategories_1 = require("./ProductCategories");
let Product = class Product {
};
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Product.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Product.prototype, "namear", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "offerPrice", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Product.prototype, "vendorId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Product.prototype, "productCategoryId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Product.prototype, "productSubCategoryId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => Vendor_1.Vendor, { nullable: true }),
    __metadata("design:type", Vendor_1.Vendor)
], Product.prototype, "vendor", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => ProductCategories_1.ProductCategories, { nullable: true }),
    __metadata("design:type", ProductCategories_1.ProductCategories)
], Product.prototype, "productCategory", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "catalogId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "pageNo", void 0);
Product = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Product model" })
], Product);
exports.Product = Product;
const productSchema = new mongoose_1.Schema({
    name: String,
    namear: String,
    price: Number,
    offerPrice: Number,
    expiry: Date,
    vendorId: { type: mongoose_1.default.Types.ObjectId, ref: "Vendor" },
    productCategoryId: { type: mongoose_1.default.Types.ObjectId, ref: "ProductCategories" },
    productSubCategoryId: { type: mongoose_1.default.Types.ObjectId, ref: "ProductSubCategories" },
    image: String,
    catalogId: { type: mongoose_1.default.Types.ObjectId, ref: "Catalog" },
    pageNo: Number,
});
const ProductModel = mongoose_1.default.model('Product', productSchema);
exports.default = ProductModel;
//# sourceMappingURL=Products.js.map