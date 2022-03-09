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
exports.Trigger = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importStar(require("mongoose"));
let Trigger = class Trigger {
};
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], Trigger.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Trigger.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Trigger.prototype, "refId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Trigger.prototype, "action", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Trigger.prototype, "user", void 0);
Trigger = __decorate([
    (0, type_graphql_1.ObjectType)({ description: "The Trigger model" })
], Trigger);
exports.Trigger = Trigger;
const triggerSchema = new mongoose_1.Schema({
    refId: mongoose_1.default.Types.ObjectId,
    action: String,
    user: mongoose_1.default.Types.ObjectId
});
const TriggerModel = mongoose_1.default.model('Trigger', triggerSchema);
exports.default = TriggerModel;
//# sourceMappingURL=Trigger.js.map