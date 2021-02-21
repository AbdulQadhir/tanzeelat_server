import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import CatalogModel, { Catalog } from "../models/Catalog";
import { CatalogInput } from "../gqlObjectTypes/catalog.type";

 
@Resolver()
export class CatalogResolver {
    
    @Query(() => [Catalog])
    async catalogs(
        @Arg("vendorId") vendorId : String
    ): Promise<Catalog[]> {
        return await CatalogModel.find({vendorId});
    }
    
    @Query(() => Catalog)
    async catalogDt(
        @Arg("id") id : String
    ): Promise<Catalog> {
        return await CatalogModel.findById(id);
    }

    @Mutation(() => Catalog)
    async addCatalog(
        @Arg("input") input: CatalogInput
    ): Promise<Catalog> {
        const user = new CatalogModel({...input});
        const result = await user.save();
        return result;
    }
}
