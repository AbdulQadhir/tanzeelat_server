import moment from "moment";
import "reflect-metadata";
import { CatalogViewAnalyticsOutput } from "../gqlObjectTypes/analytics.types";
import { Resolver, Query, Arg } from "type-graphql";

@Resolver()
export class AnalyticsResolver {
  @Query(() => CatalogViewAnalyticsOutput)
  async catalogViewAnalytics(
    @Arg("fromDate") fromDate: String,
    @Arg("catalogId") catalogId: String
  ): Promise<CatalogViewAnalyticsOutput> {
    // const result = await runReport("61c4362dd101af39276449d9");
    const result = await runReport(catalogId, fromDate);
    return result;
  }
}

const propertyId = "300168872";

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();
async function runReport(catalog_id: String, fromDate: String) {
  const colView = `catalog_view_${catalog_id}`;
  const colOpen = `catalog_open_${catalog_id}`;

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
        name: "eventName",
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
      orGroup: {
        expressions: [
          {
            filter: {
              stringFilter: {
                matchType: "EXACT",
                value: colOpen,
              },
              fieldName: "eventName",
            },
          },
          {
            filter: {
              stringFilter: {
                matchType: "EXACT",
                value: colView,
              },
              fieldName: "eventName",
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

      if (row.dimensionValues[1].value == colOpen)
        clicks[index] = row.metricValues[1].value;
      if (row.dimensionValues[1].value == colView) {
        unique[index] = row.metricValues[0].value;
        views[index] = row.metricValues[1].value;
      }

      // console.log(
      //   row.dimensionValues[0].value,
      //   row.dimensionValues[1].value,
      //   row.metricValues[0].value,
      //   row.metricValues[1].value
      // );
    }
  );

  return { unique, views, clicks };
}
