import "reflect-metadata";
import CityModel, { City } from "../models/City";
import { Resolver, Query } from "type-graphql";

@Resolver()
export class CityAreaResolver {
  @Query(() => [City])
  async getCities(): Promise<City[]> {
    const cities = await CityModel.find();
    return cities;
  }
}
