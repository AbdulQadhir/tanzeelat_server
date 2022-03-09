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
exports.CouponViewAnalyticsOutput = exports.CatalogViewPlaceAnalyticsOutput = exports.CatalogViewAnalyticsOutput = void 0;
const type_graphql_1 = require("type-graphql");
let CatalogViewAnalyticsOutput = class CatalogViewAnalyticsOutput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CatalogViewAnalyticsOutput.prototype, "unique", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CatalogViewAnalyticsOutput.prototype, "views", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CatalogViewAnalyticsOutput.prototype, "clicks", void 0);
CatalogViewAnalyticsOutput = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "Catalog Logs" })
], CatalogViewAnalyticsOutput);
exports.CatalogViewAnalyticsOutput = CatalogViewAnalyticsOutput;
let CatalogViewPlaceAnalyticsOutput = class CatalogViewPlaceAnalyticsOutput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CatalogViewPlaceAnalyticsOutput.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CatalogViewPlaceAnalyticsOutput.prototype, "count", void 0);
CatalogViewPlaceAnalyticsOutput = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "Catalog Logs" })
], CatalogViewPlaceAnalyticsOutput);
exports.CatalogViewPlaceAnalyticsOutput = CatalogViewPlaceAnalyticsOutput;
let CouponViewAnalyticsOutput = class CouponViewAnalyticsOutput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CouponViewAnalyticsOutput.prototype, "unique", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CouponViewAnalyticsOutput.prototype, "views", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], CouponViewAnalyticsOutput.prototype, "redeems", void 0);
CouponViewAnalyticsOutput = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "Catalog Logs" })
], CouponViewAnalyticsOutput);
exports.CouponViewAnalyticsOutput = CouponViewAnalyticsOutput;
//# sourceMappingURL=analytics.types.js.map