'use stric'

const Constants = require('../config/constants');
const crypto = require('crypto');

module.exports = {
    meters: new Map([
        [1, Constants.ServerRequest[1].prefix],
        [2, Constants.ServerRequest[2].prefix],
    ]),

    generateId(size, type) {
       try {
            size = size || 8;
            const meterRand = crypto.randomBytes(size).toString('hex').toUpperCase();
            return `${this.meters.get(type)}${meterRand}`;
       } catch (error) {
            throw new Error(error);
       }
    }

}