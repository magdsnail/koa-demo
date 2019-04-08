'use strict'

const models = require('./models');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
var cors = require('koa2-cors');

const koalogger = require('koa-logger');
const logger = require('../logger');

module.exports = {
    router: new Router(),
    server: new Koa(),

    initRoute() {
        const methods = models.methods;
        for(let element of methods) {
            const Inst = require(`./controller/${element.module}`);
            const inst = new Inst();
            const action = element.action;
            const url = element.prefix ? element.prefix : `/${element.module}/${action}`;
            this.router[element.method](url, inst[action].bind(inst));
        }
    },

    start(opts) {
        this.server.use(bodyParser());
        this.server.use(cors())
        this.server.use(koalogger());
        this.server
            .use(this.router.routes())
            .use(this.router.allowedMethods());
            
        
        this.server.listen(opts.service.port, opts.service.host, (err) => {
            if (err) return reject(err);
            logger.info('listening at', `http://${opts.service.host}:${opts.service.port}`);
        });
    }

}