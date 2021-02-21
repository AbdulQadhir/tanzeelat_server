import "reflect-metadata";
import { VendorOutletInput } from "../gqlObjectTypes/vendoroutlet.type";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import VendorOutletModel, {VendorOutlet} from "../models/VendorOutlet"

 
@Resolver()
export class VendorOutletResolver {
    @Query(() => [VendorOutlet])
    async vendorOutlets(
        @Arg("vendorId") vendorId: String
    ): Promise<VendorOutlet[]> {
        return VendorOutletModel.find({vendorId});
    }

    @Mutation(() => VendorOutlet)
    async addVendorOutlet(
        @Arg("input") input: VendorOutletInput
    ): Promise<VendorOutlet> {
        const user = new VendorOutletModel({...input});
        const result = await user.save();
        return result;
    }
}
