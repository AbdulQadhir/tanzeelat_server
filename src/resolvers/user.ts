import "reflect-metadata";
import { LoginInput, LoginResponse, AddUserInput, AddUserResponse } from "../gqlObjectTypes/user.types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql"
import UserModel, {User} from "../models/User"
import { sendOTP } from "../utils/otp";
import OtpModel from "../models/OTP";
import { Context } from "vm";

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
        
        const user = await UserModel.findOne({$or: [{mobile: input.email}, {mobile: "971"+input.email}, {email: input.email}]});
        if(!user)
            return {
                errors : [{message: "Invalid Login"}]
            }

        if(!user.verified)
            return {
                errors : [{message: "Mobile No. not Verified"}]
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
                token,
                name: user.name,
                city: user.city
            }
        }
        else
            return {
                errors : [{message: "Invalid Login"}]
            }
    }

    @Query(() => Boolean)
    async verifyOtp(
        @Arg("mobile") mobile : string,
        @Arg("otp") otp : string,
    ): Promise<Boolean> {

        const _otp = await OtpModel.findOne({mobile})
        
        if(_otp){
            await UserModel.findOneAndUpdate({mobile},{verified: true});
            return _otp.otp == otp;
        }
        else
            return false;
    }

    @Query(() => User)
    async getProfileDt(
        @Ctx() ctx: Context
        ): Promise<User> {

        const userId = ctx.userId;
        const user = await UserModel.findById(userId,"name mobile email city");
        console.log(userId);
        console.log(user);
        return user;
    }

    @Query(() => Boolean)
    async resendOtp(
        @Arg("mobile") mobile : string
    ): Promise<Boolean> {

        const otp = randomInteger();
        sendOTP(mobile, otp);

        await OtpModel.updateOne({ mobile },{ mobile, otp}, {upsert: true});
        return true;
    }

    @Mutation(() => Boolean)
    async changePassword(
        @Ctx() ctx: Context,
        @Arg("oldPassword") oldPassword : string,
        @Arg("password") password : string
    ): Promise<Boolean> {
        const userId = ctx.userId;

        const passMatch = await UserModel.findById(userId);
        const match = await bcrypt.compare(oldPassword, passMatch?.password);
        if(!match)
            return false;
        
        const hashedPass = await bcrypt.hash(password, saltRounds);
        await UserModel.findByIdAndUpdate(userId,{password: hashedPass});

        return true;
    }

    @Mutation(() => Boolean)
    async resetPassword(
        @Arg("mobile") mobile : string,
        @Arg("otp") otp : string,
        @Arg("password") password : string
    ): Promise<Boolean> {
        const _mobile = mobile.length == 10 ? mobile.substr(1) : mobile;
        const _otp = await OtpModel.findOne({mobile:_mobile})
        
        if(_otp?.otp == otp){
            const hashedPass = await bcrypt.hash(password, saltRounds);
            await UserModel.findOneAndUpdate({mobile},{password: hashedPass});
            return true;
        }
        else
            return false;
    }

    @Mutation(() => AddUserResponse)
    async registerUser(
        @Arg("input") input: AddUserInput
    ): Promise<AddUserResponse> {

        const checkDupEmail = await UserModel.countDocuments({email: input.email});
        if(checkDupEmail>0)
            return {
                errors: [{message: "Email already exists!"}]
            }

        const checkDupMob = await UserModel.countDocuments({mobile: input.mobile});
        if(checkDupMob>0)
            return {
                errors: [{message: "Mobile already exists!"}]
            }
            
        const user = new UserModel({...input});

        const hashedPass = await bcrypt.hash(input.password, saltRounds);
        if(input.mobile.length == 10)
            user.mobile = input.mobile.substr(1);
        user.password = hashedPass;
        user.verified = false;
        const result = await user.save();

        const otp = randomInteger();
        sendOTP(result.mobile, otp);

        await OtpModel.updateOne({ mobile: input.mobile },{ mobile: input.mobile, otp}, {upsert: true});
        
        return {
            userId: result._id
        };
    }
}

function randomInteger() {
    var min = 1000;
    var max = 9999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}