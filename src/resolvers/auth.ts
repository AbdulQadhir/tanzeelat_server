import "reflect-metadata";
import { LoginOutput } from "../gqlObjectTypes/auth.types";
import { LoginInput } from "../gqlObjectTypes/user.types";
import AgentModel from "../models/Agent";
import SuperAdminModel from "../models/SuperAdmin";
import { Resolver, Query, Arg } from "type-graphql"
import { Roles } from "../enums/roles.enum";
import { States } from "../enums/state.enum";
import VendorUserModel from "../models/VendorUser";
import VendorModel from "../models/Vendor";

const fs   = require('fs');
const jwt  = require('jsonwebtoken');

function getToken (userId : string, roles: [string], userType: string) {
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
        userId,
        roles,
        userType
    };
    var token = jwt.sign(payload, privateKEY, signOptions);
    return token;
}

export const checkVendorAccess = async (vendorId: string, userId: string) => {

    if(userId == vendorId) return true;

    const admin = await SuperAdminModel.findById(userId);
    if(admin) return true;
    
    const agent = await AgentModel.findById(userId);
    if(agent){
        const accessVendors = agent.accessVendors || [];
        if(accessVendors.includes(vendorId))
            return true;
        else
            return false;
    }
    else return false;
}

export const accessibleVendorList = async (userId: string) => {

    const admin = await SuperAdminModel.findById(userId);
    if(admin) return ["all"];
    
    const agent = await AgentModel.findById(userId);
    if(agent){
        return agent.accessVendors || [];
    }
    
    const vendoruser = await VendorUserModel.findById(userId);
    if(vendoruser){
        return [vendoruser.vendorId] || [];
    }

    return [];
}

@Resolver()
export class AuthResolver {
    @Query(() => LoginOutput)
    async weblogin(
        @Arg("input") input: LoginInput
    ): Promise<LoginOutput> {
        console.log(input);
        const admin = await SuperAdminModel.findOne({email: input.email});
        if(admin)
        {
            if(admin.password == input.password)
                return {
                    token: getToken(admin._id, admin.roles, "SUPERADMIN"),
                    roles: admin.roles,
                    userType: "SUPERADMIN",
                }
            else
                return {
                    error: "Invalid login"
                }
        }
        else {
            const agent = await AgentModel.findOne({email: input.email});
            if(agent)
            {
                if(agent.password == input.password)
                    return {
                        token: getToken(agent._id, agent.roles, "AGENT"),
                        roles: agent.roles,
                        userType: "AGENT",
                    }
                else
                    return {
                        error: "Invalid login"
                    }
            }
            else{
                const vendorUser = await VendorUserModel.findOne({username: input.email});
                if(vendorUser)
                {
                    const vendor = await VendorModel.findById(vendorUser.vendorId,"shopname logo")
                    if(vendorUser.password == input.password)
                        return {
                            token: getToken(vendorUser._id, [Roles.VendorManageRole], "VENDOR"),
                            roles: [Roles.VendorManageRole],
                            userType: "VENDOR",
                            id: vendorUser._id,
                            vendorId: vendorUser.vendorId,
                            vendor
                        }
                    else
                        return {
                            error: "Invalid login"
                        }
                }
                else
                    return {
                        error: "Invalid login"
                    }
            }
        }
    }

    @Query(() => [String])
    getAccessRoles(): String[] {
        return Object.values(Roles);
    }

    @Query(() => [String])
    getStates(): String[] {
        return Object.values(States);
    }

}
