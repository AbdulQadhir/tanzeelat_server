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
exports.CatalogCatagoriesResolver = void 0;
require("reflect-metadata");
const catalogcategories_types_1 = require("../gqlObjectTypes/catalogcategories.types");
const type_graphql_1 = require("type-graphql");
const CatalogCategories_1 = __importStar(require("../models/CatalogCategories"));
const roles_enum_1 = require("../enums/roles.enum");
let CatalogCatagoriesResolver = class CatalogCatagoriesResolver {
    async catalogCategories() {
        const cats = await CatalogCategories_1.default.find();
        return cats;
    }
    async catalogCategoryDt(id) {
        const CatalogCategory = await CatalogCategories_1.default.findById(id);
        return CatalogCategory;
    }
    async addCatalogCategory(input, ctx) {
        var _a;
        if (!((_a = ctx.roles) === null || _a === void 0 ? void 0 : _a.includes(roles_enum_1.Roles.SettingsManageRole))) { }
        const user = new CatalogCategories_1.default({ ...input });
        const result = await user.save();
        return result;
    }
    async updCatalogCategory(input, id) {
        const result = await CatalogCategories_1.default.findByIdAndUpdate(id, {
            $set: {
                name: input.name,
                namear: input.namear
            }
        });
        return result;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [CatalogCategories_1.CatalogCategories]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogCatagoriesResolver.prototype, "catalogCategories", null);
__decorate([
    (0, type_graphql_1.Query)(() => CatalogCategories_1.CatalogCategories),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogCatagoriesResolver.prototype, "catalogCategoryDt", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CatalogCategories_1.CatalogCategories),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalogcategories_types_1.CatalogCategoryInput, Object]),
    __metadata("design:returntype", Promise)
], CatalogCatagoriesResolver.prototype, "addCatalogCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CatalogCategories_1.CatalogCategories),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalogcategories_types_1.CatalogCategoryInput,
        String]),
    __metadata("design:returntype", Promise)
], CatalogCatagoriesResolver.prototype, "updCatalogCategory", null);
CatalogCatagoriesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CatalogCatagoriesResolver);
exports.CatalogCatagoriesResolver = CatalogCatagoriesResolver;
//# sourceMappingURL=catalogcategories.js.map