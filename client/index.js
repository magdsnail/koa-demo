'use strict'

const request = require('request');
const rp = require('request-promise');

module.exports = {
    get(url, params) {
        const options = {
            uri: url,
            qs: params,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        return new Promise((resolve, reject) => {
            rp(options)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    post(url, data) {
        const options = {
            method: 'POST',
            uri: url,
            body: data,
            json: true
        };
        return new Promise((resolve, reject) => {
            rp(options)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

}