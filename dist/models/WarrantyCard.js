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
exports.WarrantyCard = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importStar(require("mongoose"));
let WarrantyCard = class WarrantyCard {
};
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], WarrantyCard.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "brand", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "model", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "invoiceNo", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], WarrantyCard.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], WarrantyCard.prototype, "purchaseDate", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], WarrantyCard.prototype, "warrantyTerm", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "store", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "contact", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "notes", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WarrantyCard.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WarrantyCard.prototype, "image1", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WarrantyCard.prototype, "image2", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WarrantyCard.prototype, "image3", void 0);
WarrantyCard = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Warranty Card model" })
], WarrantyCard);
exports.WarrantyCard = WarrantyCard;
const WarrantyCardSchema = new mongoose_1.Schema({
    name: String,
    brand: String,
    model: String,
    category: String,
    invoiceNo: String,
    price: Number,
    purchaseDate: Date,
    warrantyTerm: Date,
    store: String,
    contact: String,
    notes: String,
    image1: String,
    image2: String,
    image3: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
});
const WarrantyCardModel = mongoose_1.default.model('WarrantyCard', WarrantyCardSchema);
exports.default = WarrantyCardModel;
//# sourceMappingURL=WarrantyCard.js.map