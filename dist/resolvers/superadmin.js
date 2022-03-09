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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const SuperAdmin_1 = __importStar(require("../models/SuperAdmin"));
const superadmin_types_1 = require("../gqlObjectTypes/superadmin.types");
let SuperAdminResolver = class SuperAdminResolver {
    async superadmins() {
        const cats = await SuperAdmin_1.default.find();
        console.log(cats);
        return cats;
    }
    async superAdminDt(id) {
        const superAdmin = await SuperAdmin_1.default.findById(id);
        return superAdmin;
    }
    async addSuperAdmin(input) {
        const user = new SuperAdmin_1.default({ ...input });
        const result = await user.save();
        return result;
    }
    async updateSuperAdmin(input, id) {
        const result = await SuperAdmin_1.default.findByIdAndUpdate(id, {
            $set: {
                name: input.name,
                password: input.password,
                email: input.email,
                phone: input.phone,
                roles: input.roles
            }
        });
        return result;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [SuperAdmin_1.SuperAdmin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminResolver.prototype, "superadmins", null);
__decorate([
    (0, type_graphql_1.Query)(() => SuperAdmin_1.SuperAdmin),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminResolver.prototype, "superAdminDt", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => SuperAdmin_1.SuperAdmin),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [superadmin_types_1.SuperAdminInput]),
    __metadata("design:returntype", Promise)
], SuperAdminResolver.prototype, "addSuperAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => SuperAdmin_1.SuperAdmin),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [superadmin_types_1.SuperAdminInput, String]),
    __metadata("design:returntype", Promise)
], SuperAdminResolver.prototype, "updateSuperAdmin", null);
SuperAdminResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SuperAdminResolver);
exports.SuperAdminResolver = SuperAdminResolver;
//# sourceMappingURL=superadmin.js.map