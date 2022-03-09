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
exports.AnalyticsResolver = void 0;
const moment_1 = __importDefault(require("moment"));
require("reflect-metadata");
const analytics_types_1 = require("../gqlObjectTypes/analytics.types");
const type_graphql_1 = require("type-graphql");
const propertyId = "300168872";
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const analyticsDataClient = new BetaAnalyticsDataClient();
let AnalyticsResolver = class AnalyticsResolver {
    async catalogViewAnalytics(fromDate, catalogId) {
        const result = await runCatalogAnalyticsReport(catalogId, fromDate);
        return result;
    }
    async catalogViewPlaceAnalytics(catalogId) {
        const result = await runCatalogPlaceAnalyticsReport(catalogId);
        return result;
    }
    async couponViewAnalytics(fromDate, couponId) {
        const result = await runCouponAnalyticsReport(couponId, fromDate);
        return result;
    }
    async couponViewPlaceAnalytics(couponId) {
        const result = await runCouponPlaceAnalyticsReport(couponId);
        return result;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => analytics_types_1.CatalogViewAnalyticsOutput),
    __param(0, (0, type_graphql_1.Arg)("fromDate")),
    __param(1, (0, type_graphql_1.Arg)("catalogId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "catalogViewAnalytics", null);
__decorate([
    (0, type_graphql_1.Query)(() => analytics_types_1.CatalogViewPlaceAnalyticsOutput),
    __param(0, (0, type_graphql_1.Arg)("catalogId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "catalogViewPlaceAnalytics", null);
__decorate([
    (0, type_graphql_1.Query)(() => analytics_types_1.CouponViewAnalyticsOutput),
    __param(0, (0, type_graphql_1.Arg)("fromDate")),
    __param(1, (0, type_graphql_1.Arg)("couponId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "couponViewAnalytics", null);
__decorate([
    (0, type_graphql_1.Query)(() => analytics_types_1.CatalogViewPlaceAnalyticsOutput),
    __param(0, (0, type_graphql_1.Arg)("couponId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "couponViewPlaceAnalytics", null);
AnalyticsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AnalyticsResolver);
exports.AnalyticsResolver = AnalyticsResolver;
async function runCatalogPlaceAnalyticsReport(catalog_id) {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: "2020-03-31",
                endDate: "today",
            },
        ],
        dimensions: [
            {
                name: "customEvent:catalog_event_type",
            },
            {
                name: "customEvent:catalog_id",
            },
            {
                name: "customEvent:event_location_name",
            },
        ],
        metrics: [
            {
                name: "active1DayUsers",
            },
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            stringFilter: {
                                matchType: "EXACT",
                                value: "View",
                            },
                            fieldName: "customEvent:catalog_event_type",
                        },
                    },
                    {
                        filter: {
                            stringFilter: {
                                matchType: "EXACT",
                                value: catalog_id,
                            },
                            fieldName: "customEvent:catalog_id",
                        },
                    },
                ],
            },
        },
    });
    let location = [];
    let count = [];
    response.rows.forEach((row) => {
        location.push(row.dimensionValues[2].value);
        count.push(row.metricValues[0].value);
    });
    return { location, count };
}
async function runCatalogAnalyticsReport(catalog_id, fromDate) {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: "2020-03-31",
                endDate: "today",
            },
        ],
        dimensions: [
            {
                name: "date",
            },
            {
                name: "customEvent:catalog_event_type",
            },
            {
                name: "customEvent:catalog_id",
            },
        ],
        metrics: [
            {
                name: "active1DayUsers",
            },
            {
                name: "eventCount",
            },
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        orGroup: {
                            expressions: [
                                {
                                    filter: {
                                        stringFilter: {
                                            matchType: "EXACT",
                                            value: "Open",
                                        },
                                        fieldName: "customEvent:catalog_event_type",
                                    },
                                },
                                {
                                    filter: {
                                        stringFilter: {
                                            matchType: "EXACT",
                                            value: "View",
                                        },
                                        fieldName: "customEvent:catalog_event_type",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        filter: {
                            stringFilter: {
                                matchType: "EXACT",
                                value: catalog_id,
                            },
                            fieldName: "customEvent:catalog_id",
                        },
                    },
                ],
            },
        },
    });
    let dates = [];
    let views = [0, 0, 0, 0, 0, 0, 0];
    let clicks = [0, 0, 0, 0, 0, 0, 0];
    let unique = [0, 0, 0, 0, 0, 0, 0];
    const dateFrom = (0, moment_1.default)(fromDate.toString(), "YYYYMMDD");
    dates.push(fromDate.toString());
    for (var i = 0; i < 6; i++) {
        const date = dateFrom.add(1, "d").format("YYYYMMDD");
        dates.push(date);
    }
    response.rows.forEach((row) => {
        const index = dates.findIndex((el) => el == row.dimensionValues[0].value);
        if (row.dimensionValues[1].value == "Open")
            clicks[index] = row.metricValues[1].value;
        if (row.dimensionValues[1].value == "View") {
            unique[index] = row.metricValues[0].value;
            views[index] = row.metricValues[1].value;
        }
    });
    return { unique, views, clicks };
}
async function runCouponPlaceAnalyticsReport(coupon_id) {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: "2020-03-31",
                endDate: "today",
            },
        ],
        dimensions: [
            {
                name: "customEvent:coupon_event_type",
            },
            {
                name: "customEvent:coupon_id",
            },
            {
                name: "customEvent:event_location_name",
            },
        ],
        metrics: [
            {
                name: "active1DayUsers",
            },
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            stringFilter: {
                                matchType: "EXACT",
                                value: "Open",
                            },
                            fieldName: "customEvent:coupon_event_type",
                        },
                    },
                    {
                        filter: {
                            stringFilter: {
                                matchType: "EXACT",
                                value: coupon_id,
                            },
                            fieldName: "customEvent:coupon_id",
                        },
                    },
                ],
            },
        },
    });
    let location = [];
    let count = [];
    response.rows.forEach((row) => {
        location.push(row.dimensionValues[2].value);
        count.push(row.metricValues[0].value);
    });
    return { location, count };
}
async function runCouponAnalyticsReport(coupon_id, fromDate) {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: "2020-03-31",
                endDate: "today",
            },
        ],
        dimensions: [
            {
                name: "date",
            },
            {
                name: "customEvent:coupon_event_type",
            },
            {
                name: "customEvent:coupon_id",
            },
        ],
        metrics: [
            {
                name: "active1DayUsers",
            },
            {
                name: "eventCount",
            },
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        orGroup: {
                            expressions: [
                                {
                                    filter: {
                                        stringFilter: {
                                            matchType: "EXACT",
                                            value: "Open",
                                        },
                                        fieldName: "customEvent:coupon_event_type",
                                    },
                                },
                                {
                                    filter: {
                                        stringFilter: {
                                            matchType: "EXACT",
                                            value: "Redeem",
                                        },
                                        fieldName: "customEvent:coupon_event_type",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        filter: {
                            stringFilter: {
                                matchType: "EXACT",
                                value: coupon_id,
                            },
                            fieldName: "customEvent:coupon_id",
                        },
                    },
                ],
            },
        },
    });
    let dates = [];
    let views = [0, 0, 0, 0, 0, 0, 0];
    let redeems = [0, 0, 0, 0, 0, 0, 0];
    let unique = [0, 0, 0, 0, 0, 0, 0];
    const dateFrom = (0, moment_1.default)(fromDate.toString(), "YYYYMMDD");
    dates.push(fromDate.toString());
    for (var i = 0; i < 6; i++) {
        const date = dateFrom.add(1, "d").format("YYYYMMDD");
        dates.push(date);
    }
    response.rows.forEach((row) => {
        const index = dates.findIndex((el) => el == row.dimensionValues[0].value);
        if (row.dimensionValues[1].value == "Redeem")
            redeems[index] = row.metricValues[1].value;
        if (row.dimensionValues[1].value == "Open") {
            unique[index] = row.metricValues[0].value;
            views[index] = row.metricValues[1].value;
        }
    });
    return { unique, views, redeems };
}
//# sourceMappingURL=analytics.js.map