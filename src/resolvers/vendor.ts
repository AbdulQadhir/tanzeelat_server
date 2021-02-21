import "reflect-metadata";
import { LoginInput, LoginResponse, AddVendorInput } from "../gqlObjectTypes/vendor.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import VendorModel, {Vendor} from "../models/Vendor"

const bcrypt = require('bcrypt');
const saltRounds = 10;

const fs   = require('fs');
const jwt  = require('jsonwebtoken');

 
@Resolver()
export class VendorResolver {
    @Query(() => [Vendor])
    async vendors(): Promise<Vendor[]> {
        return await VendorModel.find();
    }

    @Query(() => Vendor)
    async vendorDt(
        @Arg("id") id : String
    ): Promise<Vendor> {
        const vendor = await VendorModel.findOne({});
        console.log(id);
        return vendor;
    }

    @Query(() => LoginResponse)
    async login(
        @Arg("input") input : LoginInput 
    ): Promise<LoginResponse>{
        
        const user = await VendorModel.findOne({username: input.username});
        if(!user)
            return {
                errors : [{message: "Invalid Login"}]
            }

        const match = await bcrypt.compare(input.password, user.password);
        if(match)
        {
            var privateKEY  = fs.readFileSync('src/keys/private.key', 'utf8');
            var i  = 'tanzeelat';          // Issuer 
            var s  = 'tanzeelat';        // Subject 
            var a  = 'tanzeelat'; // Audience// SIGNING OPTIONS
            var signOptions = {
             issuer:  i,
             subject:  s,
             audience:  a,
             expiresIn:  "12h",
             algorithm:  "RS256"
            };
            var payload = {
                userId: user._id
            };
            var token = jwt.sign(payload, privateKEY, signOptions);
            return {
                token
            }
        }
        else
            return {
                errors : [{message: "Invalid Login"}]
            }
    }

    @Mutation(() => Vendor)
    async registerVendor(
        @Arg("input") input: AddVendorInput
    ): Promise<Vendor> {
        const user = new VendorModel({...input});

        const hashedPass = await bcrypt.hash(input.password, saltRounds);
        user.password = hashedPass;
        const result = await user.save();

        return result;
    }
}