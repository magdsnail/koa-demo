'use strict'

const logger = require('pino-step/helper/logger');

const config = require('./config/config');

logger.level = config.logger.level;
logger.pretty = config.logger.pretty;
logger.name = config.logger.name;

module.exports = logger;