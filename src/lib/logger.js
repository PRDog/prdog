const winston = require('winston');

const logger = new winston.Logger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      timestamp: true,
      json: true,
      stringify: true,
      dumpExceptions: true,
      showStack: true
    })
  ]
});

process.on('unhandledRejection', logger.error);
process.on('uncaughtException', logger.error);

module.exports = logger;
