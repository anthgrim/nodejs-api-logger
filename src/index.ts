// @ts-ignore
import generalFormatter from 'general-formatter'
import { appendFileSync, existsSync, mkdirSync, createReadStream } from 'fs'
import { Level, Levels, LogOptions } from '../types'

/**
 * @description Object with list of default levels
 */
export const defaultLevels: Levels = {
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
}

/**
 * @summary Main logging function
 * @description Logs and write to the console
 * @param {LogOptions} options
 * @note Available levels: info, database, debug, access, error, and fatal
 * @note If the level name does not exist, the default level info will be added
 * @return {void} void
 */
export function log(options: LogOptions): void {
  const { levelName, error } = options
  const targetLevel: Level = defaultLevels.hasOwnProperty(levelName)
    ? defaultLevels[levelName]
    : defaultLevels.info
  if (error !== undefined) {
    options.message = `${error.name} - ${error.message}\n${error.stack}`
  }

  // Write to the console
  writeToConsole(targetLevel, options.message)

  if (targetLevel.writeToFile) {
    writeToFile(targetLevel, options.message)
  }
}

/**
 * @description Write to the console
 * @param {Level} targetLevel
 * @param {string} message
 * @param {Error | undefined} error
 */
function writeToConsole(targetLevel: Level, message: string): void {
  const date = generalFormatter.convertToDateString(new Date(), 'en-US')
  const header = `\x1b[${targetLevel.color}m[${targetLevel.value}] - ${date}\x1b[0m`

  console.log(`${header}: ${message}`)
}

/**
 * @description Write to file
 * @param {Level} targetLevel
 * @param {string} message
 * @param {Error | undefined} error
 */
function writeToFile(targetLevel: Level, message: string): void {}
