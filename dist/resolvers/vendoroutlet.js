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
exports.VendorOutletResolver = void 0;
require("reflect-metadata");
const vendoroutlet_type_1 = require("../gqlObjectTypes/vendoroutlet.type");
const type_graphql_1 = require("type-graphql");
const VendorOutlet_1 = __importStar(require("../models/VendorOutlet"));
const VendorUser_1 = __importDefault(require("../models/VendorUser"));
const mongoose_1 = require("mongoose");
let VendorOutletResolver = class VendorOutletResolver {
    async vendorOutlets(vendorId) {
        return VendorOutlet_1.default.find({ vendorId });
    }
    async vendorAccessibleOutlets(vendorId, ctx) {
        const vendorUser = await VendorUser_1.default.findById(ctx.userId);
        if (ctx.userType == "VENDOR") {
            return VendorOutlet_1.default.find({
                _id: {
                    $in: (vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.outlets.map((el) => new mongoose_1.Types.ObjectId(el.toString()))) || [],
                },
            });
        }
        else {
            return VendorOutlet_1.default.find({ vendorId });
        }
    }
    async vendorOutletDt(id) {
        return VendorOutlet_1.default.findOne({ _id: id });
    }
    async vendorOutletsNear(coords) {
        console.log(coords);
        return VendorOutlet_1.default.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [24.223362706796227, 55.74355086474318],
                    },
                    distanceField: "distance",
                    maxDistance: 20000,
                    includeLocs: "location",
                    spherical: true,
                },
            },
        ]);
    }
    async addVendorOutlet(input) {
        var _a, _b;
        let location = {
            type: "Point",
            coordinates: [0, 0],
        };
        if (input.location) {
            (location.coordinates[0] = parseFloat((_a = input.location) === null || _a === void 0 ? void 0 : _a.lat) || 0),
                (location.coordinates[1] = parseFloat((_b = input.location) === null || _b === void 0 ? void 0 : _b.lng) || 0);
        }
        const user = new VendorOutlet_1.default({ ...input, location });
        const result = await user.save();
        return result;
    }
    async updVendorOutlet(input, id) {
        var _a, _b;
        let location = {
            type: "Point",
            coordinates: [0, 0],
        };
        if (input.location) {
            (location.coordinates[0] = parseFloat((_a = input.location) === null || _a === void 0 ? void 0 : _a.lat) || 0),
                (location.coordinates[1] = parseFloat((_b = input.location) === null || _b === void 0 ? void 0 : _b.lng) || 0);
        }
        const result = await VendorOutlet_1.default.findByIdAndUpdate(id, {
            $set: {
                name: input.name,
                namear: input.namear,
                state: input.state,
                place: input.place,
                location: location,
                workingHours: input.workingHours,
            },
        });
        return result;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [VendorOutlet_1.VendorOutlet]),
    __param(0, (0, type_graphql_1.Arg)("vendorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorOutletResolver.prototype, "vendorOutlets", null);
__decorate([
    (0, type_graphql_1.Query)(() => [VendorOutlet_1.VendorOutlet]),
    __param(0, (0, type_graphql_1.Arg)("vendorId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorOutletResolver.prototype, "vendorAccessibleOutlets", null);
__decorate([
    (0, type_graphql_1.Query)(() => VendorOutlet_1.VendorOutlet),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorOutletResolver.prototype, "vendorOutletDt", null);
__decorate([
    (0, type_graphql_1.Query)(() => [VendorOutlet_1.VendorOutlet]),
    __param(0, (0, type_graphql_1.Arg)("coords")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VendorOutletResolver.prototype, "vendorOutletsNear", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => VendorOutlet_1.VendorOutlet),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendoroutlet_type_1.VendorOutletInput]),
    __metadata("design:returntype", Promise)
], VendorOutletResolver.prototype, "addVendorOutlet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => VendorOutlet_1.VendorOutlet),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendoroutlet_type_1.VendorOutletInput, String]),
    __metadata("design:returntype", Promise)
], VendorOutletResolver.prototype, "updVendorOutlet", null);
VendorOutletResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], VendorOutletResolver);
exports.VendorOutletResolver = VendorOutletResolver;
//# sourceMappingURL=vendoroutlet.js.map