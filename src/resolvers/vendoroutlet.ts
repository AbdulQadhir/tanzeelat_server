import "reflect-metadata";
import { VendorOutletInput } from "../gqlObjectTypes/vendoroutlet.type";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql"
import VendorOutletModel, {VendorOutlet} from "../models/VendorOutlet"
import { Context } from "vm";
import VendorUserModel from "../models/VendorUser";
import { Types } from "mongoose";

@Resolver()
export class VendorOutletResolver {
    @Query(() => [VendorOutlet])
    async vendorOutlets(
        @Arg("vendorId") vendorId: String
    ): Promise<VendorOutlet[]> {
        return VendorOutletModel.find({vendorId});
    }

    @Query(() => [VendorOutlet])
    async vendorAccessibleOutlets(
        @Arg("vendorId") vendorId: String,
        @Ctx() ctx: Context
    ): Promise<VendorOutlet[]> {
        const vendorUser = await VendorUserModel.findById(ctx.userId);

        if(ctx.userType == "VENDOR"){
            return VendorOutletModel.find({ _id: { $in: vendorUser?.outlets.map((el: Types.ObjectId) => Types.ObjectId(el.toString())) || [] }});
        }else {
            return VendorOutletModel.find({vendorId})
        }
    }

    @Query(() => VendorOutlet)
    async vendorOutletDt(
        @Arg("id") id: String
    ): Promise<VendorOutlet> {
        return VendorOutletModel.findOne({_id:id});
    }
    
    @Query(() => [VendorOutlet])
    async vendorOutletsNear(
        @Arg("coords") coords: Number
    ): Promise<VendorOutlet[]> {
        console.log(coords);
        return VendorOutletModel.aggregate([
            {
                $geoNear : {
                    near: { type: "Point", coordinates: [24.223362706796227, 55.74355086474318] },
                    distanceField: "distance",
                    maxDistance: 20000,
                    includeLocs: "location",
                    spherical: true
                }
            }
        ])
    }

    @Mutation(() => VendorOutlet)
    async addVendorOutlet(
        @Arg("input") input: VendorOutletInput
    ): Promise<VendorOutlet> {
        let location = {
            type : "Point",
            coordinates : [0,0]
        }
        if(input.location)
        {
            location.coordinates[0] = parseFloat(input.location?.lat) || 0,
            location.coordinates[1] = parseFloat(input.location?.lng) || 0
        }
        const user = new VendorOutletModel({...input, location});
        const result = await user.save();
        return result;
    }

    @Mutation(() => VendorOutlet)
    async updVendorOutlet(
        @Arg("input") input: VendorOutletInput,
        @Arg("id") id: string
    ): Promise<VendorOutlet> {
        let location = {
            type : "Point",
            coordinates : [0,0]
        }
        if(input.location)
        {
            location.coordinates[0] = parseFloat(input.location?.lat) || 0,
            location.coordinates[1] = parseFloat(input.location?.lng) || 0
        }
        const result = await VendorOutletModel.findByIdAndUpdate(id,{
            $set:{
                name: input.name,
                namear:input.namear,
                state: input.state,
                place:input.place,
                location:location,
                workingHours:input.workingHours
            }
        });
        return result;
    }
}
