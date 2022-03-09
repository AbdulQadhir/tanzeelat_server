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
exports.CouponSubCategoryInput = exports.CouponCategoryInput = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_upload_1 = require("graphql-upload");
let CouponCategoryInput = class CouponCategoryInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponCategoryInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponCategoryInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], CouponCategoryInput.prototype, "image", void 0);
CouponCategoryInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Coupon Category data" })
], CouponCategoryInput);
exports.CouponCategoryInput = CouponCategoryInput;
let CouponSubCategoryInput = class CouponSubCategoryInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponSubCategoryInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponSubCategoryInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], CouponSubCategoryInput.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CouponSubCategoryInput.prototype, "couponCategoryId", void 0);
CouponSubCategoryInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Coupon sub Category data" })
], CouponSubCategoryInput);
exports.CouponSubCategoryInput = CouponSubCategoryInput;
//# sourceMappingURL=couponcategories.types.js.map