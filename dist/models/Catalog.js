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
exports.Catalog = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importStar(require("mongoose"));
const VendorOutlet_1 = require("./VendorOutlet");
const catalogstatus_enum_1 = require("../enums/catalogstatus.enum");
const Vendor_1 = require("./Vendor");
const CatalogCategories_1 = require("./CatalogCategories");
let Catalog = class Catalog {
};
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], Catalog.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Catalog.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Catalog.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Catalog.prototype, "titlear", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], Catalog.prototype, "startDate", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], Catalog.prototype, "expiry", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Catalog.prototype, "vendorId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Catalog.prototype, "status", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Catalog.prototype, "catalogCategoryId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => [VendorOutlet_1.VendorOutlet]),
    __metadata("design:type", Array)
], Catalog.prototype, "outlets", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => CatalogCategories_1.CatalogCategories, { nullable: true }),
    __metadata("design:type", CatalogCategories_1.CatalogCategories)
], Catalog.prototype, "catalogCategoryDt", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => Vendor_1.Vendor, { nullable: true }),
    __metadata("design:type", Vendor_1.Vendor)
], Catalog.prototype, "vendor", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Catalog.prototype, "pdf", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Catalog.prototype, "pages", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Catalog.prototype, "thumbnails", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], Catalog.prototype, "enabled", void 0);
Catalog = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Catalog model" })
], Catalog);
exports.Catalog = Catalog;
const catalogSchema = new mongoose_1.Schema({
    title: String,
    titlear: String,
    startDate: Date,
    expiry: Date,
    status: { type: String, default: catalogstatus_enum_1.CatalogStatus.PENDING },
    vendorId: { type: mongoose_1.default.Types.ObjectId, ref: "Vendor" },
    catalogCategoryId: { type: mongoose_1.default.Types.ObjectId, ref: "CatalogCategories" },
    outlets: [{ type: mongoose_1.default.Types.ObjectId, ref: "VendorOutlet" }],
    pages: [String],
    pdf: String,
    thumbnails: [String],
    enabled: { type: Boolean, default: true }
});
const CatalogModel = mongoose_1.default.model('Catalog', catalogSchema);
exports.default = CatalogModel;
//# sourceMappingURL=Catalog.js.map