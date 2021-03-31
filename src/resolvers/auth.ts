import "reflect-metadata";
import { LoginOutput } from "../gqlObjectTypes/auth.types";
import { LoginInput } from "../gqlObjectTypes/user.types";
import AgentModel from "../models/Agent";
import SuperAdminModel from "../models/SuperAdmin";
import VendorModel from "../models/Vendor";
import { Resolver, Query, Arg } from "type-graphql"

const fs   = require('fs');
const jwt  = require('jsonwebtoken');

function getToken (userId : string, roles: string) {
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
        roles
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

@Resolver()
export class AuthResolver {
    @Query(() => LoginOutput)
    async weblogin(
        @Arg("input") input: LoginInput
    ): Promise<LoginOutput> {
        const admin = await SuperAdminModel.findOne({email: input.email});
        if(admin)
        {
            if(admin.password == input.password)
                return {
                    token: getToken(admin._id, admin.roles),
                    roles: admin.roles
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
                        token: getToken(agent._id, agent.roles),
                        roles: agent.roles
                    }
                else
                    return {
                        error: "Invalid login"
                    }
            }
            else{
                const vendor = await VendorModel.findOne({username: input.email});
                if(vendor)
                {
                    if(vendor.password == input.password)
                        return {
                            token: input.email,
                            roles: []
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

}
