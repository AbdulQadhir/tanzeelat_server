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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const VendorUser_1 = __importStar(require("../models/VendorUser"));
const vendoruser_types_1 = require("../gqlObjectTypes/vendoruser.types");
const mongoose_1 = __importDefault(require("mongoose"));
let VendorUserResolver = class VendorUserResolver {
    async vendorUsers(vendorId) {
        const users = await VendorUser_1.default.find({ vendorId: vendorId, active: true }, "username");
        return users;
    }
    async vendorUserDt(id) {
        const users = await VendorUser_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "vendoroutlets",
                    localField: "outlets",
                    foreignField: "_id",
                    as: "outletsDt",
                },
            },
        ]);
        return (users === null || users === void 0 ? void 0 : users.length) > 0 && users[0];
    }
    async updateVendorUser(input, id) {
        let replace = {};
        replace = {
            $set: {
                username: input.username,
                password: input.password,
                outlets: input.outlets,
            },
        };
        const result = await VendorUser_1.default.findByIdAndUpdate(id, replace);
        return result;
    }
    async addVendorUser(input) {
        const user = new VendorUser_1.default({ ...input });
        const result = await user.save();
        return result;
    }
    async delVendorUser(id) {
        await VendorUser_1.default.findByIdAndUpdate(id, { active: false });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [VendorUser_1.VendorUser]),
    __param(0, (0, type_graphql_1.Arg)("vendorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorUserResolver.prototype, "vendorUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => VendorUser_1.VendorUser),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorUserResolver.prototype, "vendorUserDt", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => VendorUser_1.VendorUser),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendoruser_types_1.AddVendorUserInput,
        String]),
    __metadata("design:returntype", Promise)
], VendorUserResolver.prototype, "updateVendorUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => VendorUser_1.VendorUser),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendoruser_types_1.AddVendorUserInput]),
    __metadata("design:returntype", Promise)
], VendorUserResolver.prototype, "addVendorUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorUserResolver.prototype, "delVendorUser", null);
VendorUserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], VendorUserResolver);
exports.VendorUserResolver = VendorUserResolver;
//# sourceMappingURL=vendoruser.js.map