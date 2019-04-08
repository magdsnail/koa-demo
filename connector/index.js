'use strict'

const logger = require('../logger');

const Connector = require('./connector');
const MongoConnector = require('./mongo-connector');
const RedisConnector = require('./redis-connector');

module.exports = {

    init: async function (opts) {
        for (let i in opts) {
            const opt = opts[i];
            if (opt.type === 'mongo') {
                this[opt.name] = new MongoConnector(opt);                
            } else if (opt.type === 'redis') {
                this[opt.name] = new RedisConnector(opt);
            } else {
                logger.warn('unknown database type - ', opt.name);
            }
        }

        const keys = Object.keys(this);
        for (let i in keys) {
            const db = this[keys[i]];
            if (db instanceof Connector) {
                await db.connect();
            }
        }
    },

    close: async function (opts) {
        const keys = Object.keys(this);
        for (let i in keys) {
            const db = this[keys[i]];
            if (db instanceof Connector) {
                await db.close();
            }
        }   
    }
    
};
