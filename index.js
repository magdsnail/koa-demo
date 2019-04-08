'use strict'

const logger = require('./logger');
const app = require('./app');

app.init(require('./config/config'))
.then(() => {
    app.start();
    logger.info('start success!');
})
.catch((err) => {
    logger.info('start err.', err);
    app.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('got ctrl-c to exit.');
    app.close();
    process.exit(0);
});