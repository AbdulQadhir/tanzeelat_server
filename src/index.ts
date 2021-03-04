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
import { CouponCatagoriesResolver } from "./resolvers/couponcategories";
import { graphqlUploadExpress } from "graphql-upload";

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
                CouponResolver,
                CouponCatagoriesResolver
            ]
        }),
        uploads: false
    })

    app.use(graphqlUploadExpress({ maxFiles: 30 }));
     
    server.applyMiddleware({ app });

    //await mongoose.connect('mongodb://localhost:27017/advapp', {useNewUrlParser: true, useUnifiedTopology: true});
    await mongoose.connect('mongodb+srv://ncod:ncod@cluster0.5eqrd.mongodb.net/tanzeelat?authSource=admin&replicaSet=atlas-249yja-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {useNewUrlParser: true, useUnifiedTopology: true});
    
    app.listen({ port: process.env.PORT }, () => 
        console.log(` Server ready`)
    );
}

startServer();