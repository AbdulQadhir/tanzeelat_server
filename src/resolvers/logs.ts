import "reflect-metadata";
import LogModel from "../models/Log";
import { Resolver, Arg, Mutation, Ctx } from "type-graphql"
import { Context } from "vm";
import { LogInput } from "../gqlObjectTypes/log.types";
 
const moment = require("moment");

@Resolver()
export class LogResolver {

    @Mutation(() => Boolean)
    async pushLog(
        @Arg("input") input: LogInput,
        @Ctx() ctx: Context
    ): Promise<Boolean> {

        const userId = ctx.userId;
        const type = input.type;

        for (const log of input?.logs) {
            const _log = new LogModel({
                userId,
                type,
                catalogId: log.catalogId,
                page: log.page,
                time: moment(log.time).toDate()
            });
            await _log.save()
        }

        return true;
    }
}
