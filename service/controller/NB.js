'use strict'

const connector = require('../../connector').mcee;
const logger = require('../../logger');
const Result = require('../../config/result');
const Constants = require('../../config/constants');
const helper = require('../helper');

const client = require('../../client');

module.exports = class NB {
    async test(ctx, next) {
        try {
            const body = ctx.request.body;
            ctx.body = body;
            await next();
        } catch (err) {
            logger.warn(err);
            ctx.response.body = Result.SERVICE_EXCEPTION
        }
    }


}
