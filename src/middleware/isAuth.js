import { skip } from 'graphql-resolvers';

export const isAuth = (_,__,{me}) => {
    new Error("Not Authenticated");
}