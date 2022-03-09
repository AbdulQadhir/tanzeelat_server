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
exports.NotificationResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const OneSignal = __importStar(require("onesignal-node"));
const notification_types_1 = require("../gqlObjectTypes/notification.types");
const uuid_1 = require("uuid");
const Notification_1 = __importDefault(require("../models/Notification"));
const Notification_2 = require("../models/Notification");
const User_1 = __importDefault(require("../models/User"));
const path = require("path");
const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";
const BUCKET_NAME = "tanzeelat";
const AWS = require("aws-sdk");
let NotificationResolver = class NotificationResolver {
    async getUserNotifications(ctx) {
        const userId = ctx.userId;
        return Notification_1.default.find({ users: userId });
    }
    async delNotification(id, ctx) {
        const userId = ctx.userId;
        await Notification_1.default.updateOne({ _id: id }, { $pull: { users: userId } });
        return true;
    }
    async sendNotification(input) {
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        let image = "";
        if (input.image) {
            const { createReadStream, filename, mimetype } = await input.image;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype,
            })
                .promise();
            console.log(Location);
            image = Location;
        }
        const client = new OneSignal.Client("8010025e-cf62-4172-a3d1-5753bdb00d58", "Mzg1MzQ4NTEtZjkzYi00ZTQ1LWJjNzgtYWE2ZWEyZDhlNGY0");
        const notification = {
            headings: {
                ar: input.title,
                en: input.titlear,
            },
            contents: {
                ar: input.title,
                en: input.titlear,
            },
            data: {
                description: input.description,
                descriptionar: input.descriptionar,
                image: image,
                type: "general",
            },
            included_segments: ["Active Users"],
        };
        try {
            const response = await client.createNotification(notification);
            console.log(response.body);
        }
        catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                console.log(e.statusCode);
                console.log(e.body);
            }
        }
        return true;
    }
    async sendUserNotification(input) {
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        let image = "";
        if (input.image) {
            const { createReadStream, filename, mimetype } = await input.image;
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: createReadStream(),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                ContentType: mimetype,
            })
                .promise();
            console.log(Location);
            image = Location;
        }
        const users = await User_1.default.find({ playerId: { $exists: true } }, { playerId: 1 });
        const playerIds = users.map((el) => el.playerId);
        const userIds = users.map((el) => el._id);
        const _notification = new Notification_1.default({
            title: input.title,
            titlear: input.titlear,
            description: input.description,
            descriptionar: input.descriptionar,
            image,
            users: userIds,
        });
        try {
            await _notification.save();
        }
        catch (ex) {
            console.log(ex);
        }
        const client = new OneSignal.Client("8010025e-cf62-4172-a3d1-5753bdb00d58", "Mzg1MzQ4NTEtZjkzYi00ZTQ1LWJjNzgtYWE2ZWEyZDhlNGY0");
        const notification = {
            headings: {
                ar: input.title,
                en: input.titlear,
            },
            contents: {
                ar: input.title,
                en: input.titlear,
            },
            data: {
                description: input.description,
                descriptionar: input.descriptionar,
                image: image,
                type: "specific",
            },
            include_player_ids: playerIds,
        };
        try {
            const response = await client.createNotification(notification);
            console.log(response.body);
        }
        catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                console.log(e.statusCode);
                console.log(e.body);
            }
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Notification_2.Notification]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "getUserNotifications", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "delNotification", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_types_1.NotificationInput]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "sendNotification", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_types_1.NotificationInput]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "sendUserNotification", null);
NotificationResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], NotificationResolver);
exports.NotificationResolver = NotificationResolver;
//# sourceMappingURL=notification.js.map