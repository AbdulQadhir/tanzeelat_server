import "reflect-metadata";
import { LoginInput, LoginResponse, AddUserInput } from "../gqlObjectTypes/user.types";
import { Resolver, Query, Arg, Mutation } from "type-graphql"
import UserModel, {User} from "../models/User"

const bcrypt = require('bcrypt');
const saltRounds = 10;

const fs   = require('fs');
const jwt  = require('jsonwebtoken');

 
@Resolver()
export class UserResolver {
    @Query(() => [User])
    async users(): Promise<User[]> {
        return UserModel.find();
    }

    @Query(() => LoginResponse)
    async login(
        @Arg("input") input : LoginInput 
    ): Promise<LoginResponse>{
        
        const user = await UserModel.findOne({email: input.email});
        if(!user)
            return {
                errors : [{message: "Invalid Login"}]
            }

        const match = await bcrypt.compare(input.password, user.password);
        if(match)
        {
            var privateKEY  = fs.readFileSync('src/keys/private.key', 'utf8');
            var i  = 'advapp';          // Issuer 
            var s  = 'advapp';        // Subject 
            var a  = 'advapp'; // Audience// SIGNING OPTIONS
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

    @Mutation(() => User)
    async registerUser(
        @Arg("input") input: AddUserInput
    ): Promise<User> {
        const user = new UserModel({...input});

        const hashedPass = await bcrypt.hash(input.password, saltRounds);
        user.password = hashedPass;
        const result = await user.save();

        return result;
    }
}