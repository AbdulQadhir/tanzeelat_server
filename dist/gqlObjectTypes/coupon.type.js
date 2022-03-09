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
exports.HistoryItem = exports.CouponFilterOutput = exports.CouponSummary = exports.CouponRedeemOutput = exports.CouponRedeemDetails = exports.CouponUnveil = exports.CouponFilterInput = exports.CouponInput = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_upload_1 = require("graphql-upload");
const Vendor_1 = require("../models/Vendor");
const Coupon_1 = require("../models/Coupon");
const VendorOutlet_1 = require("../models/VendorOutlet");
let CouponInput = class CouponInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponInput.prototype, "descriptionar", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponInput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponInput.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponInput.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponInput.prototype, "couponCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponInput.prototype, "terms", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponInput.prototype, "termsar", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponInput.prototype, "couponSubCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], CouponInput.prototype, "outlets", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], CouponInput.prototype, "menu", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], CouponInput.prototype, "thumbnail", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], CouponInput.prototype, "thumbnailAr", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], CouponInput.prototype, "redeemLimit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], CouponInput.prototype, "featured", void 0);
CouponInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Coupon data" })
], CouponInput);
exports.CouponInput = CouponInput;
let CouponFilterInput = class CouponFilterInput {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponFilterInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponFilterInput.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponFilterInput.prototype, "search", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CouponFilterInput.prototype, "coordinates", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponFilterInput.prototype, "sortBy", void 0);
CouponFilterInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "Coupon filter" })
], CouponFilterInput);
exports.CouponFilterInput = CouponFilterInput;
let CouponUnveil = class CouponUnveil {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponUnveil.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponUnveil.prototype, "couponId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponUnveil.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponUnveil.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponUnveil.prototype, "coupon", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponUnveil.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponUnveil.prototype, "descriptionar", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CouponUnveil.prototype, "redeemed", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], CouponUnveil.prototype, "menu", void 0);
CouponUnveil = __decorate([
    (0, type_graphql_1.ObjectType)()
], CouponUnveil);
exports.CouponUnveil = CouponUnveil;
let CouponRedeemDetails = class CouponRedeemDetails {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponRedeemDetails.prototype, "couponId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponRedeemDetails.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponRedeemDetails.prototype, "vendorUserId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponRedeemDetails.prototype, "outletId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponRedeemDetails.prototype, "state", void 0);
CouponRedeemDetails = __decorate([
    (0, type_graphql_1.ObjectType)()
], CouponRedeemDetails);
exports.CouponRedeemDetails = CouponRedeemDetails;
let CouponRedeemOutput = class CouponRedeemOutput {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CouponRedeemOutput.prototype, "result", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponRedeemOutput.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => CouponRedeemDetails, { nullable: true }),
    __metadata("design:type", CouponRedeemDetails)
], CouponRedeemOutput.prototype, "details", void 0);
CouponRedeemOutput = __decorate([
    (0, type_graphql_1.ObjectType)()
], CouponRedeemOutput);
exports.CouponRedeemOutput = CouponRedeemOutput;
let CouponSummary = class CouponSummary {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CouponSummary.prototype, "sent", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CouponSummary.prototype, "redeemed", void 0);
CouponSummary = __decorate([
    (0, type_graphql_1.ObjectType)()
], CouponSummary);
exports.CouponSummary = CouponSummary;
let CouponFilterOutput = class CouponFilterOutput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponFilterOutput.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], CouponFilterOutput.prototype, "distance", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => VendorOutlet_1.VendorOutlet, { nullable: true }),
    __metadata("design:type", VendorOutlet_1.VendorOutlet)
], CouponFilterOutput.prototype, "outlet", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Vendor_1.Vendor),
    __metadata("design:type", Vendor_1.Vendor)
], CouponFilterOutput.prototype, "vendor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Coupon_1.Coupon),
    __metadata("design:type", Coupon_1.Coupon)
], CouponFilterOutput.prototype, "coupon", void 0);
CouponFilterOutput = __decorate([
    (0, type_graphql_1.ObjectType)()
], CouponFilterOutput);
exports.CouponFilterOutput = CouponFilterOutput;
let HistoryItem = class HistoryItem {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HistoryItem.prototype, "coupon_name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HistoryItem.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HistoryItem.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], HistoryItem.prototype, "index", void 0);
HistoryItem = __decorate([
    (0, type_graphql_1.ObjectType)()
], HistoryItem);
exports.HistoryItem = HistoryItem;
//# sourceMappingURL=coupon.type.js.map