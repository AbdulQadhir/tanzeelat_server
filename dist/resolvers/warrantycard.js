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
exports.WarrantyCardResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const WarrantyCard_1 = __importStar(require("../models/WarrantyCard"));
const uuid_1 = require("uuid");
const warranrycard_types_1 = require("../gqlObjectTypes/warranrycard.types");
const path = require("path");
const ID = 'AKIAID3BSRIGM4OQ5J6A';
const SECRET = '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';
const BUCKET_NAME = 'tanzeelat';
const AWS = require('aws-sdk');
let WarrantyCardResolver = class WarrantyCardResolver {
    async warrantyCards(userId) {
        return await WarrantyCard_1.default.find({ userId });
    }
    async addWarrantyCard(input) {
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        });
        let image1 = "";
        let image2 = "";
        let image3 = "";
        if (input.image1) {
            const { createReadStream, filename, mimetype } = await input.image1;
            const { Location } = await s3.upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype
            }).promise();
            image1 = Location;
        }
        if (input.image2) {
            const { createReadStream, filename, mimetype } = await input.image2;
            const { Location } = await s3.upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype
            }).promise();
            image1 = Location;
        }
        if (input.image3) {
            const { createReadStream, filename, mimetype } = await input.image3;
            const { Location } = await s3.upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype
            }).promise();
            image1 = Location;
        }
        const warrantyCard = new WarrantyCard_1.default({ ...input, image1, image2, image3 });
        const result = await warrantyCard.save();
        return result;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [WarrantyCard_1.WarrantyCard]),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarrantyCardResolver.prototype, "warrantyCards", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => WarrantyCard_1.WarrantyCard),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [warranrycard_types_1.WarrantyCardInput]),
    __metadata("design:returntype", Promise)
], WarrantyCardResolver.prototype, "addWarrantyCard", null);
WarrantyCardResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WarrantyCardResolver);
exports.WarrantyCardResolver = WarrantyCardResolver;
//# sourceMappingURL=warrantycard.js.map