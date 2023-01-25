"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.defaultLevels = void 0;
const generalFormatter = require("general-formatter");
/**
 * @description Object with list of default levels
 */
exports.defaultLevels = {
    info: {
        value: 'INFO',
        color: '34',
        writeToFile: true
    },
    database: {
        value: 'DATABASE',
        color: '32',
        writeToFile: true
    },
    debug: {
        value: 'DEBUG',
        color: '36',
        writeToFile: false
    },
    access: {
        value: 'ACCESS',
        color: '35',
        writeToFile: true
    },
    error: {
        value: 'ERROR',
        color: '31',
        writeToFile: true
    },
    fatal: {
        value: 'FATAL',
        color: '31;1',
        writeToFile: true
    }
};
/**
 * @summary Main logging function
 * @description Logs and write to the console
 * @param {LogOptions} options
 * @note Available levels: info, database, debug, access, error, and fatal
 * @note If the level name does not exist, the default level info will be added
 * @return {void} void
 */
function log(options) {
    const { levelName, error } = options;
    const targetLevel = exports.defaultLevels.hasOwnProperty(levelName)
        ? exports.defaultLevels[levelName]
        : exports.defaultLevels.info;
    if (error !== undefined) {
        options.message = `${error.name} - ${error.message}\n${error.stack}`;
    }
    // Write to the console
    writeToConsole(targetLevel, options.message);
    // if (targetLevel.writeToFile) {
    //   writeToFile(targetLevel, options.message)
    // }
}
exports.log = log;
log({ levelName: 'debug', message: 'Testing' });
/**
 * @description Write to the console
 * @param {Level} targetLevel
 * @param {string} message
 * @param {Error | undefined} error
 */
function writeToConsole(targetLevel, message) {
    const date = generalFormatter.convertToMoneyString(new Date(), 'en-US', 'currency', 'USD');
    const header = `\x1b[${targetLevel.color}m [${targetLevel.value}] - ${date}\x1b[0m`;
    console.log(`${header}: ${message}`);
}
/**
 * @description Write to file
 * @param {Level} targetLevel
 * @param {string} message
 * @param {Error | undefined} error
 */
function writeToFile(targetLevel, message) { }
