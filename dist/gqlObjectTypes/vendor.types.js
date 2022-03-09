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
exports.VendorExtra = exports.VendorLoginInput = exports.VendorLoginResponse = exports.VendorFieldError = exports.WorkingHours = exports.WorkingHoursInput = exports.AddVendorInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const user_types_1 = require("./user.types");
const graphql_upload_1 = require("graphql-upload");
let AddVendorInput = class AddVendorInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "brandname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "shopname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "tradelicense", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddVendorInput.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", user_types_1.LocationInput)
], AddVendorInput.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddVendorInput.prototype, "ownername", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddVendorInput.prototype, "ownerphone", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "owneremail", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "contactname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "contactphone", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "contactmobile", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "contactemail", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], AddVendorInput.prototype, "logo", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVendorInput.prototype, "grade", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddVendorInput.prototype, "about", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddVendorInput.prototype, "subtitle", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], AddVendorInput.prototype, "shopimage", void 0);
AddVendorInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New Vendor data" })
], AddVendorInput);
exports.AddVendorInput = AddVendorInput;
let WorkingHoursInput = class WorkingHoursInput {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], WorkingHoursInput.prototype, "active", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WorkingHoursInput.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WorkingHoursInput.prototype, "to", void 0);
WorkingHoursInput = __decorate([
    (0, type_graphql_1.InputType)()
], WorkingHoursInput);
exports.WorkingHoursInput = WorkingHoursInput;
let WorkingHours = class WorkingHours {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], WorkingHours.prototype, "active", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WorkingHours.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WorkingHours.prototype, "to", void 0);
WorkingHours = __decorate([
    (0, type_graphql_1.ObjectType)()
], WorkingHours);
exports.WorkingHours = WorkingHours;
let VendorFieldError = class VendorFieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorFieldError.prototype, "message", void 0);
VendorFieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], VendorFieldError);
exports.VendorFieldError = VendorFieldError;
let VendorLoginResponse = class VendorLoginResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [VendorFieldError], { nullable: true }),
    __metadata("design:type", Array)
], VendorLoginResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorLoginResponse.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorLoginResponse.prototype, "token", void 0);
VendorLoginResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], VendorLoginResponse);
exports.VendorLoginResponse = VendorLoginResponse;
let VendorLoginInput = class VendorLoginInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorLoginInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorLoginInput.prototype, "namear", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorLoginInput.prototype, "password", void 0);
VendorLoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], VendorLoginInput);
exports.VendorLoginInput = VendorLoginInput;
let VendorExtra = class VendorExtra {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], VendorExtra.prototype, "catalogs", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], VendorExtra.prototype, "coupons", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], VendorExtra.prototype, "outlets", void 0);
VendorExtra = __decorate([
    (0, type_graphql_1.ObjectType)()
], VendorExtra);
exports.VendorExtra = VendorExtra;
//# sourceMappingURL=vendor.types.js.map