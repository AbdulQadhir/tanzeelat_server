import moment from "moment";
import "reflect-metadata";
import {
  CatalogViewAnalyticsOutput,
  CatalogViewPlaceAnalyticsOutput,
  CouponViewAnalyticsOutput,
} from "../gqlObjectTypes/analytics.types";
import { Resolver, Query, Arg } from "type-graphql";

const propertyId = "300168872";
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const analyticsDataClient = new BetaAnalyticsDataClient();

@Resolver()
export class AnalyticsResolver {
  @Query(() => CatalogViewAnalyticsOutput)
  async catalogViewAnalytics(
    @Arg("fromDate") fromDate: String,
    @Arg("catalogId") catalogId: String
  ): Promise<CatalogViewAnalyticsOutput> {
    // const result = await runCatalogPlaceAnalyticsReport(
    //   "61e679988f9568704ed59702",
    //   "20220122"
    // );
    const result = await runCatalogAnalyticsReport(catalogId, fromDate);
    return result;
  }

  @Query(() => CatalogViewPlaceAnalyticsOutput)
  async catalogViewPlaceAnalytics(
    @Arg("catalogId") catalogId: String
  ): Promise<CatalogViewPlaceAnalyticsOutput> {
    const result = await runCatalogPlaceAnalyticsReport(catalogId);
    return result;
  }

  @Query(() => CouponViewAnalyticsOutput)
  async couponViewAnalytics(
    @Arg("fromDate") fromDate: String,
    @Arg("couponId") couponId: String
  ): Promise<CouponViewAnalyticsOutput> {
    // const result = await runCatalogPlaceAnalyticsReport(
    //   "61e679988f9568704ed59702",
    //   "20220122"
    // );
    const result = await runCouponAnalyticsReport(couponId, fromDate);
    return result;
  }

  @Query(() => CatalogViewPlaceAnalyticsOutput)
  async couponViewPlaceAnalytics(
    @Arg("couponId") couponId: String
  ): Promise<CatalogViewPlaceAnalyticsOutput> {
    const result = await runCouponPlaceAnalyticsReport(couponId);
    return result;
  }
}

async function runCatalogPlaceAnalyticsReport(catalog_id: String) {
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

  let location: any[] = [];
  let count: any[] = [];

  response.rows.forEach(
    (row: { dimensionValues: any[]; metricValues: any[] }) => {
      location.push(row.dimensionValues[2].value);
      count.push(row.metricValues[0].value);
    }
  );

  return { location, count };
}

async function runCatalogAnalyticsReport(catalog_id: String, fromDate: String) {
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

  let dates: string[] = [];
  let views = [0, 0, 0, 0, 0, 0, 0];
  let clicks = [0, 0, 0, 0, 0, 0, 0];
  let unique = [0, 0, 0, 0, 0, 0, 0];

  const dateFrom = moment(fromDate.toString(), "YYYYMMDD");

  dates.push(fromDate.toString());
  for (var i = 0; i < 6; i++) {
    const date = dateFrom.add(1, "d").format("YYYYMMDD");
    dates.push(date);
  }

  response.rows.forEach(
    (row: { dimensionValues: any[]; metricValues: any[] }) => {
      const index = dates.findIndex((el) => el == row.dimensionValues[0].value);

      if (row.dimensionValues[1].value == "Open")
        clicks[index] = row.metricValues[1].value;
      if (row.dimensionValues[1].value == "View") {
        unique[index] = row.metricValues[0].value;
        views[index] = row.metricValues[1].value;
      }

      // console.log(
      //   row.dimensionValues[0].value,
      //   row.dimensionValues[1].value,
      //   row.dimensionValues[2].value,
      //   row.metricValues[0].value,
      //   row.metricValues[1].value
      // );
    }
  );

  return { unique, views, clicks };
}

async function runCouponPlaceAnalyticsReport(coupon_id: String) {
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

  let location: any[] = [];
  let count: any[] = [];

  response.rows.forEach(
    (row: { dimensionValues: any[]; metricValues: any[] }) => {
      location.push(row.dimensionValues[2].value);
      count.push(row.metricValues[0].value);
    }
  );

  return { location, count };
}

async function runCouponAnalyticsReport(coupon_id: String, fromDate: String) {
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

  let dates: string[] = [];
  let views = [0, 0, 0, 0, 0, 0, 0];
  let redeems = [0, 0, 0, 0, 0, 0, 0];
  let unique = [0, 0, 0, 0, 0, 0, 0];

  const dateFrom = moment(fromDate.toString(), "YYYYMMDD");

  dates.push(fromDate.toString());
  for (var i = 0; i < 6; i++) {
    const date = dateFrom.add(1, "d").format("YYYYMMDD");
    dates.push(date);
  }

  response.rows.forEach(
    (row: { dimensionValues: any[]; metricValues: any[] }) => {
      const index = dates.findIndex((el) => el == row.dimensionValues[0].value);

      if (row.dimensionValues[1].value == "Redeem")
        redeems[index] = row.metricValues[1].value;
      if (row.dimensionValues[1].value == "Open") {
        unique[index] = row.metricValues[0].value;
        views[index] = row.metricValues[1].value;
      }

      // console.log(
      //   row.dimensionValues[0].value,
      //   row.dimensionValues[1].value,
      //   row.dimensionValues[2].value,
      //   row.metricValues[0].value,
      //   row.metricValues[1].value
      // );
    }
  );

  return { unique, views, redeems };
}
