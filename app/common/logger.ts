import * as winston from 'winston';
import * as utils from 'util';
import { config } from '../config/app-config';
import { Environment } from './environments';
const tsFormat = () => (new Date()).toLocaleTimeString();
export const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            logstash: config.get('NODE_ENV') !== Environment.DEV && config.get('NODE_ENV') !== Environment.TEST,
            colorize: config.get('NODE_ENV') === Environment.DEV,
            level: config.get('LOG_LEVEL')
        })
    ]
});

function formatLogArgs(args) {
    return [utils.format.apply(utils.format, Array.prototype.slice.call(args))];
}

console.log = function () {
    logger.info.apply(logger, formatLogArgs(arguments));
};
console.info = function () {
    logger.info.apply(logger, formatLogArgs(arguments));
};
console.warn = function () {
    logger.warn.apply(logger, formatLogArgs(arguments));
};
console.error = function () {
    logger.error.apply(logger, formatLogArgs(arguments));
};
console.debug = function () {
    logger.debug.apply(logger, formatLogArgs(arguments));
};
