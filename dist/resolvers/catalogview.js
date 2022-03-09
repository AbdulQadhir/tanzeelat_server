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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogViewResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const CatalogView_1 = __importDefault(require("../models/CatalogView"));
const catalogview_types_1 = require("../gqlObjectTypes/catalogview.types");
let CatalogViewResolver = class CatalogViewResolver {
    async catalogViews(id) {
        const cats = await CatalogView_1.default.count({ catalogId: id });
        return cats || 0;
    }
    async addCatalogView(input) {
        const result = await CatalogView_1.default.findOneAndUpdate({ ...input }, {}, { upsert: true });
        return result ? false : true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogViewResolver.prototype, "catalogViews", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalogview_types_1.CatalogViewInput]),
    __metadata("design:returntype", Promise)
], CatalogViewResolver.prototype, "addCatalogView", null);
CatalogViewResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CatalogViewResolver);
exports.CatalogViewResolver = CatalogViewResolver;
//# sourceMappingURL=catalogview.js.map