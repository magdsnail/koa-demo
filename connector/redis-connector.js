'use strict'

const Redis = require('redis');

const Logger = require('../logger');
const Connector = require('./connector');

class RedisConnector extends Connector {
    constructor(opt) {
        super(opt);

        this.client = null; 
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.client = Redis.createClient(this.options.url, {
                db: this.options.base
            });
            this.client.on('connect', () => {
                Logger.debug('connected');
            });
            this.client.on('error', () => {
                Logger.debug('error');
            });
            this.client.on('end', () => {
                Logger.debug('end');
            });
            this.client.on('ready', () => {
                Logger.debug('ready');
                resolve();
            });   
        });
    }

    close() {
        if (client) {
            client.end();
            client.quit();
        }
    }

    rpush(key, values, ttl) {
        return new Promise((resolve, reject) => {
            this.client.rpush(key, values, (err, res) => {
                if (err) return reject(err);
                if (ttl !== undefined) {
                    this.client.expire(key, ttl, (err, result) => {
                        if (err) {
                            this.client.del(key, (e, r) => {
                                if (err) return reject(err);
                                reject(err);
                            });
                        }
                        resolve(res);
                    });
                } else {
                    resolve(res);
                }
            });            
        });
    }

    lrange(key, start, stop) {
        return new Promise((resolve, reject) => {
            this.client.lrange(key, start, stop, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    exists(key) {
        return new Promise((resolve, reject) => {
            this.client.exists(key, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });        
    }

    ltrim(key, start, stop) {
        return new Promise((resolve, reject) => {
            this.client.ltrim(key, start, stop, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    llen(key) {
        return new Promise((resolve, reject) => {
            this.client.llen(key, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    expire(key) {
        return new Promise((resolve, reject) => {
            this.client.expire(key, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    //set
    sadd(key, values, ttl) {
        return new Promise((resolve, reject) => {
            this.client.sadd(key, values, (err, res) => {
                if (err) return reject(err);
                if (ttl !== undefined) {
                    this.client.expire(key, ttl, (err, result) => {
                        if (err) {
                            this.client.del(key, (e, r) => {
                                if (err) return reject(err);
                            });
                        }
                        resolve(res);
                    });
                } else {
                    resolve(res);
                }
            });            
        });
    }

    sunion (keys) {
        return new Promise((resolve, reject) => {
            this.client.sunion(keys, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    del (key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}

module.exports = RedisConnector;