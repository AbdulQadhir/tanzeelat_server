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
exports.UserResolver = void 0;
require("reflect-metadata");
const user_types_1 = require("../gqlObjectTypes/user.types");
const type_graphql_1 = require("type-graphql");
const User_1 = __importStar(require("../models/User"));
const otp_1 = require("../utils/otp");
const OTP_1 = __importDefault(require("../models/OTP"));
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const jwt = require('jsonwebtoken');
let UserResolver = class UserResolver {
    async users() {
        return User_1.default.find();
    }
    async login(input) {
        const user = await User_1.default.findOne({ $or: [{ mobile: input.email }, { mobile: "971" + input.email }, { email: input.email }] });
        if (!user)
            return {
                errors: [{ message: "Invalid Login" }]
            };
        if (!user.verified)
            return {
                errors: [{ message: "Mobile No. not Verified" }]
            };
        const match = await bcrypt.compare(input.password, user.password);
        if (match) {
            var privateKEY = fs.readFileSync('src/keys/private.key', 'utf8');
            var i = 'advapp';
            var s = 'advapp';
            var a = 'advapp';
            var signOptions = {
                issuer: i,
                subject: s,
                audience: a,
                expiresIn: "12h",
                algorithm: "RS256"
            };
            var payload = {
                userId: user._id
            };
            var token = jwt.sign(payload, privateKEY, signOptions);
            return {
                token,
                name: user.name,
                city: user.city
            };
        }
        else
            return {
                errors: [{ message: "Invalid Login" }]
            };
    }
    async verifyOtp(mobile, otp) {
        const _otp = await OTP_1.default.findOne({ mobile });
        if (_otp) {
            await User_1.default.findOneAndUpdate({ mobile }, { verified: true });
            return _otp.otp == otp;
        }
        else
            return false;
    }
    async getProfileDt(ctx) {
        const userId = ctx.userId;
        const user = await User_1.default.findById(userId, "name mobile email city");
        console.log(userId);
        console.log(user);
        return user;
    }
    async resendOtp(mobile) {
        const otp = randomInteger();
        (0, otp_1.sendOTP)(mobile, otp);
        await OTP_1.default.updateOne({ mobile }, { mobile, otp }, { upsert: true });
        return true;
    }
    async changePassword(ctx, oldPassword, password) {
        const userId = ctx.userId;
        const passMatch = await User_1.default.findById(userId);
        const match = await bcrypt.compare(oldPassword, passMatch === null || passMatch === void 0 ? void 0 : passMatch.password);
        if (!match)
            return false;
        const hashedPass = await bcrypt.hash(password, saltRounds);
        await User_1.default.findByIdAndUpdate(userId, { password: hashedPass });
        return true;
    }
    async updateProfile(ctx, field, value) {
        const userId = ctx.userId;
        let update = {};
        if (field == "name")
            update = { name: value };
        else if (field == "mobile")
            update = { mobile: value };
        else if (field == "email")
            update = { email: value };
        else if (field == "playerId")
            update = { playerId: value };
        await User_1.default.findByIdAndUpdate(userId, update);
        return true;
    }
    async resetPassword(mobile, otp, password) {
        const _mobile = mobile.length == 10 ? mobile.substr(1) : mobile;
        const _otp = await OTP_1.default.findOne({ mobile: _mobile });
        if ((_otp === null || _otp === void 0 ? void 0 : _otp.otp) == otp) {
            const hashedPass = await bcrypt.hash(password, saltRounds);
            await User_1.default.findOneAndUpdate({ mobile }, { password: hashedPass });
            return true;
        }
        else
            return false;
    }
    async registerUser(input) {
        const checkDupEmail = await User_1.default.countDocuments({ email: input.email });
        if (checkDupEmail > 0)
            return {
                errors: [{ message: "Email already exists!" }]
            };
        const checkDupMob = await User_1.default.countDocuments({ mobile: input.mobile });
        if (checkDupMob > 0)
            return {
                errors: [{ message: "Mobile already exists!" }]
            };
        const user = new User_1.default({ ...input });
        const hashedPass = await bcrypt.hash(input.password, saltRounds);
        if (input.mobile.length == 10)
            user.mobile = input.mobile.substr(1);
        user.password = hashedPass;
        user.verified = false;
        const result = await user.save();
        const otp = randomInteger();
        (0, otp_1.sendOTP)(result.mobile, otp);
        await OTP_1.default.updateOne({ mobile: input.mobile }, { mobile: input.mobile, otp }, { upsert: true });
        return {
            userId: result._id
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_types_1.LoginResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_types_1.LoginInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("mobile")),
    __param(1, (0, type_graphql_1.Arg)("otp")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "verifyOtp", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getProfileDt", null);
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("mobile")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resendOtp", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("oldPassword")),
    __param(2, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("field")),
    __param(2, (0, type_graphql_1.Arg)("value")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateProfile", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("mobile")),
    __param(1, (0, type_graphql_1.Arg)("otp")),
    __param(2, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resetPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_types_1.AddUserResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_types_1.AddUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registerUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
function randomInteger() {
    var min = 1000;
    var max = 9999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}
//# sourceMappingURL=user.js.map