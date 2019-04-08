'use strict'

const connector = require('../../connector').mcee;
const logger = require('../../logger');

module.exports = class Project {
    async list(ctx, next) {
        try {
            const projectList = await connector.find('BoxProject');
        
            const items = projectList.map((info) => (
                {
                    id: info._id.toString(),
                    title: info.title
                }
            ));
            ctx.body = {
                items
            }
            await next();
        } catch (err) {
            logger.warn(err);
            ctx.response.body = {
                code: 2,
                message: err.message
             };
        }
    }
}
