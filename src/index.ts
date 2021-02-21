import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import { buildSchema } from "type-graphql";
import { UserResolver } from './resolvers/user';
import { VendorResolver } from "./resolvers/vendor";
import { CatalogCatagoriesResolver } from "./resolvers/catalogcategories";
import { VendorOutletResolver } from "./resolvers/vendoroutlet";
import { CatalogResolver } from "./resolvers/catalog";
import { CouponResolver } from "./resolvers/coupon";

require('dotenv').config();

const startServer = async() => {

    const app = express();

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserResolver, 
                VendorResolver, 
                CatalogCatagoriesResolver, 
                VendorOutletResolver,
                CatalogResolver,
                CouponResolver
            ]
        })
    })
     
    server.applyMiddleware({ app });

    await mongoose.connect('mongodb://localhost:27017/advapp', {useNewUrlParser: true, useUnifiedTopology: true});
    
    app.listen({ port: process.env.PORT }, () => 
        console.log(` Server ready`)
    );
}

startServer();