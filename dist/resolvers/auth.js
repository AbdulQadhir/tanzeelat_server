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
exports.AuthResolver = exports.accessibleVendorList = exports.checkVendorAccess = void 0;
require("reflect-metadata");
const auth_types_1 = require("../gqlObjectTypes/auth.types");
const user_types_1 = require("../gqlObjectTypes/user.types");
const Agent_1 = __importDefault(require("../models/Agent"));
const SuperAdmin_1 = __importDefault(require("../models/SuperAdmin"));
const type_graphql_1 = require("type-graphql");
const roles_enum_1 = require("../enums/roles.enum");
const state_enum_1 = require("../enums/state.enum");
const VendorUser_1 = __importDefault(require("../models/VendorUser"));
const Vendor_1 = __importDefault(require("../models/Vendor"));
const fs = require('fs');
const jwt = require('jsonwebtoken');
function getToken(userId, roles, userType) {
    var privateKEY = fs.readFileSync('src/keys/private.key', 'utf8');
    var i = 'tanzeelat';
    var s = 'tanzeelat';
    var a = 'tanzeelat';
    var signOptions = {
        issuer: i,
        subject: s,
        audience: a,
        expiresIn: "12h",
        algorithm: "RS256"
    };
    var payload = {
        userId,
        roles,
        userType
    };
    var token = jwt.sign(payload, privateKEY, signOptions);
    return token;
}
const checkVendorAccess = async (vendorId, userId) => {
    if (userId == vendorId)
        return true;
    const admin = await SuperAdmin_1.default.findById(userId);
    if (admin)
        return true;
    const agent = await Agent_1.default.findById(userId);
    if (agent) {
        const accessVendors = agent.accessVendors || [];
        if (accessVendors.includes(vendorId))
            return true;
        else
            return false;
    }
    else
        return false;
};
exports.checkVendorAccess = checkVendorAccess;
const accessibleVendorList = async (userId) => {
    const admin = await SuperAdmin_1.default.findById(userId);
    if (admin)
        return ["all"];
    const agent = await Agent_1.default.findById(userId);
    if (agent) {
        return agent.accessVendors || [];
    }
    const vendoruser = await VendorUser_1.default.findById(userId);
    if (vendoruser) {
        return [vendoruser.vendorId] || [];
    }
    return [];
};
exports.accessibleVendorList = accessibleVendorList;
let AuthResolver = class AuthResolver {
    async weblogin(input) {
        console.log(input);
        const admin = await SuperAdmin_1.default.findOne({ email: input.email });
        if (admin) {
            if (admin.password == input.password)
                return {
                    token: getToken(admin._id, admin.roles, "SUPERADMIN"),
                    roles: admin.roles,
                    userType: "SUPERADMIN",
                };
            else
                return {
                    error: "Invalid login"
                };
        }
        else {
            const agent = await Agent_1.default.findOne({ email: input.email });
            if (agent) {
                if (agent.password == input.password)
                    return {
                        token: getToken(agent._id, agent.roles, "AGENT"),
                        roles: agent.roles,
                        userType: "AGENT",
                    };
                else
                    return {
                        error: "Invalid login"
                    };
            }
            else {
                const vendorUser = await VendorUser_1.default.findOne({ username: input.email });
                if (vendorUser) {
                    const vendor = await Vendor_1.default.findById(vendorUser.vendorId, "shopname logo");
                    if (vendorUser.password == input.password)
                        return {
                            token: getToken(vendorUser._id, [roles_enum_1.Roles.VendorManageRole], "VENDOR"),
                            roles: [roles_enum_1.Roles.VendorManageRole],
                            userType: "VENDOR",
                            id: vendorUser._id,
                            vendorId: vendorUser.vendorId,
                            vendor
                        };
                    else
                        return {
                            error: "Invalid login"
                        };
                }
                else
                    return {
                        error: "Invalid login"
                    };
            }
        }
    }
    getAccessRoles() {
        return Object.values(roles_enum_1.Roles);
    }
    getStates() {
        return Object.values(state_enum_1.States);
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => auth_types_1.LoginOutput),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_types_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "weblogin", null);
__decorate([
    (0, type_graphql_1.Query)(() => [String]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AuthResolver.prototype, "getAccessRoles", null);
__decorate([
    (0, type_graphql_1.Query)(() => [String]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AuthResolver.prototype, "getStates", null);
AuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AuthResolver);
exports.AuthResolver = AuthResolver;
//# sourceMappingURL=auth.js.map