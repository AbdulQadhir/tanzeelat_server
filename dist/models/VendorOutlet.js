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
exports.VendorOutlet = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importStar(require("mongoose"));
const user_types_1 = require("../gqlObjectTypes/user.types");
const vendor_types_1 = require("../gqlObjectTypes/vendor.types");
let VendorOutlet = class VendorOutlet {
};
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], VendorOutlet.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorOutlet.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)(() => type_graphql_1.ID),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VendorOutlet.prototype, "vendorId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorOutlet.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorOutlet.prototype, "namear", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorOutlet.prototype, "state", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorOutlet.prototype, "place", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VendorOutlet.prototype, "distance", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", user_types_1.Location)
], VendorOutlet.prototype, "location", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => [vendor_types_1.WorkingHours], { nullable: true }),
    __metadata("design:type", Array)
], VendorOutlet.prototype, "workingHours", void 0);
VendorOutlet = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Vendor Outlet model" })
], VendorOutlet);
exports.VendorOutlet = VendorOutlet;
const LocationSchema = new mongoose_1.Schema({
    type: String,
    coordinates: [Number],
});
const WorkingHoursSchema = new mongoose_1.Schema({
    active: Boolean,
    from: String,
    to: String,
});
const vendorSchema = new mongoose_1.Schema({
    vendorId: { type: mongoose_1.default.Types.ObjectId, ref: "Vendor" },
    name: String,
    namear: String,
    place: String,
    state: String,
    workingHours: [WorkingHoursSchema],
    location: LocationSchema,
});
const VendorOutletModel = mongoose_1.default.model("VendorOutlet", vendorSchema);
exports.default = VendorOutletModel;
//# sourceMappingURL=VendorOutlet.js.map