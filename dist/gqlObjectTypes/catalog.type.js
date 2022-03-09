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
exports.PageInput = exports.UpdPdfInput = exports.UpdPagesInput = exports.UploadRespType = exports.CatalogFilters = exports.BookmarkInput = exports.ActiveCatalogOutputItem = exports.ActiveCatalogOutput = exports.CatalogOutput = exports.CatalogInput = void 0;
const graphql_upload_1 = require("graphql-upload");
const Vendor_1 = require("../models/Vendor");
const VendorOutlet_1 = require("../models/VendorOutlet");
const type_graphql_1 = require("type-graphql");
let CatalogInput = class CatalogInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CatalogInput.prototype, "titlear", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogInput.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogInput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogInput.prototype, "expiry", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogInput.prototype, "catalogCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], CatalogInput.prototype, "outlets", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CatalogInput.prototype, "pages", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], CatalogInput.prototype, "pdf", void 0);
CatalogInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Catalog data" })
], CatalogInput);
exports.CatalogInput = CatalogInput;
let CatalogOutput = class CatalogOutput {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CatalogOutput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogOutput.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogOutput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogOutput.prototype, "titlear", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], CatalogOutput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], CatalogOutput.prototype, "expiry", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogOutput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Vendor_1.Vendor),
    __metadata("design:type", Vendor_1.Vendor)
], CatalogOutput.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Vendor_1.Vendor, { nullable: true }),
    __metadata("design:type", Vendor_1.Vendor)
], CatalogOutput.prototype, "vendor", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CatalogOutput.prototype, "catalogCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [VendorOutlet_1.VendorOutlet]),
    __metadata("design:type", Array)
], CatalogOutput.prototype, "outlets", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => VendorOutlet_1.VendorOutlet, { nullable: true }),
    __metadata("design:type", VendorOutlet_1.VendorOutlet)
], CatalogOutput.prototype, "outlet", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CatalogOutput.prototype, "pages", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CatalogOutput.prototype, "pdf", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CatalogOutput.prototype, "thumbnails", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CatalogOutput.prototype, "distance", void 0);
CatalogOutput = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Catalog Output" })
], CatalogOutput);
exports.CatalogOutput = CatalogOutput;
let ActiveCatalogOutput = class ActiveCatalogOutput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ActiveCatalogOutput.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ActiveCatalogOutput.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ActiveCatalogOutputItem]),
    __metadata("design:type", Array)
], ActiveCatalogOutput.prototype, "catalogs", void 0);
ActiveCatalogOutput = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Catalog Output" })
], ActiveCatalogOutput);
exports.ActiveCatalogOutput = ActiveCatalogOutput;
let ActiveCatalogOutputItem = class ActiveCatalogOutputItem {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ActiveCatalogOutputItem.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ActiveCatalogOutputItem.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ActiveCatalogOutputItem.prototype, "titlear", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ActiveCatalogOutputItem.prototype, "outletName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Vendor_1.Vendor)
], ActiveCatalogOutputItem.prototype, "vendor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ActiveCatalogOutputItem.prototype, "pages", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ActiveCatalogOutputItem.prototype, "thumbnails", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ActiveCatalogOutputItem.prototype, "pdf", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [VendorOutlet_1.VendorOutlet]),
    __metadata("design:type", Array)
], ActiveCatalogOutputItem.prototype, "outlets", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => VendorOutlet_1.VendorOutlet),
    __metadata("design:type", VendorOutlet_1.VendorOutlet)
], ActiveCatalogOutputItem.prototype, "outlet", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], ActiveCatalogOutputItem.prototype, "expiry", void 0);
ActiveCatalogOutputItem = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Catalog Output" })
], ActiveCatalogOutputItem);
exports.ActiveCatalogOutputItem = ActiveCatalogOutputItem;
let BookmarkInput = class BookmarkInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], BookmarkInput.prototype, "bookmarks", void 0);
BookmarkInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "Catalog Filters" })
], BookmarkInput);
exports.BookmarkInput = BookmarkInput;
let CatalogFilters = class CatalogFilters {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CatalogFilters.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CatalogFilters.prototype, "search", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CatalogFilters.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CatalogFilters.prototype, "state", void 0);
CatalogFilters = __decorate([
    (0, type_graphql_1.InputType)({ description: "Catalog Filters" })
], CatalogFilters);
exports.CatalogFilters = CatalogFilters;
let UploadRespType = class UploadRespType {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UploadRespType.prototype, "result", void 0);
UploadRespType = __decorate([
    (0, type_graphql_1.ObjectType)()
], UploadRespType);
exports.UploadRespType = UploadRespType;
let UpdPagesInput = class UpdPagesInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [PageInput], { nullable: true }),
    __metadata("design:type", Array)
], UpdPagesInput.prototype, "files", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdPagesInput.prototype, "catalogId", void 0);
UpdPagesInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdPagesInput);
exports.UpdPagesInput = UpdPagesInput;
let UpdPdfInput = class UpdPdfInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], UpdPdfInput.prototype, "pdf", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdPdfInput.prototype, "catalogId", void 0);
UpdPdfInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdPdfInput);
exports.UpdPdfInput = UpdPdfInput;
let PageInput = class PageInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], PageInput.prototype, "newImg", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PageInput.prototype, "oldImg", void 0);
PageInput = __decorate([
    (0, type_graphql_1.InputType)()
], PageInput);
exports.PageInput = PageInput;
//# sourceMappingURL=catalog.type.js.map