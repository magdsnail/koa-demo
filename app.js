'use strict'

const load = require('./service');
const logger = require('./logger');

module.exports = {
    connector: undefined,
    options: undefined,

    async init(opts) {
        try {
            this.options = opts;

            this.connector = require('./connector');
            await this.connector.init(this.options.database);
    
            load.initRoute();
        } catch (err) {
            logger.warn(err);
        }
    },

    start() {
        load.start(this.options);
    },

    close() {
        this.connector.close(this.options.database);
    }
}