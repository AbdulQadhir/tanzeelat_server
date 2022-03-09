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
exports.LogResolver = void 0;
require("reflect-metadata");
const Log_1 = __importDefault(require("../models/Log"));
const type_graphql_1 = require("type-graphql");
const log_types_1 = require("../gqlObjectTypes/log.types");
const moment = require("moment");
let LogResolver = class LogResolver {
    async pushLog(input, ctx) {
        const userId = ctx.userId;
        const type = input.type;
        for (const log of input === null || input === void 0 ? void 0 : input.logs) {
            const _log = new Log_1.default({
                userId,
                type,
                catalogId: log.catalogId,
                page: log.page,
                time: moment(log.time).toDate()
            });
            await _log.save();
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [log_types_1.LogInput, Object]),
    __metadata("design:returntype", Promise)
], LogResolver.prototype, "pushLog", null);
LogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], LogResolver);
exports.LogResolver = LogResolver;
//# sourceMappingURL=logs.js.map