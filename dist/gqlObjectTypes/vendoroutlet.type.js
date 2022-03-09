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
exports.VendorOutletInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const user_types_1 = require("./user.types");
const vendor_types_1 = require("./vendor.types");
let VendorOutletInput = class VendorOutletInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorOutletInput.prototype, "vendorId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], VendorOutletInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorOutletInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorOutletInput.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorOutletInput.prototype, "place", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", user_types_1.LocationInput)
], VendorOutletInput.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [vendor_types_1.WorkingHoursInput], { nullable: true }),
    __metadata("design:type", Array)
], VendorOutletInput.prototype, "workingHours", void 0);
VendorOutletInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Vendor Outlet data" })
], VendorOutletInput);
exports.VendorOutletInput = VendorOutletInput;
//# sourceMappingURL=vendoroutlet.type.js.map