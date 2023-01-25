// @ts-ignore
import generalFormatter from 'general-formatter'
// @ts-ignore
import configData from '../logs.json' assert { type: 'json' }
import readLine from 'readline'
import path from 'path'
import { appendFileSync, existsSync, mkdirSync, createReadStream } from 'fs'
import { FileOptions, Level, Levels, LogOptions, ConfigData } from '../types'

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
  const logsJson: ConfigData = configData
  const levels: Levels = logsJson.levels

  const { levelName, error } = options
  const targetLevel: Level = levels.hasOwnProperty(levelName)
    ? levels[levelName]
    : levels.info
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
 * @description Gets the date and formatted time in MM/DD/YYYYTHH:MM:SS:ms
 * @returns {string} date
 */
function getCurrentDate(): string {
  const date = new Date()
  const formatted = generalFormatter.convertToDateString(date, 'en-US')
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
  return `${formatted}T${time}`
}

/**
 * @description Write to the console
 * @param {Level} targetLevel
 * @param {string} message
 */
function writeToConsole(targetLevel: Level, message: string): void {
  const header = `\x1b[${targetLevel.color}m[${
    targetLevel.value
  }] - ${getCurrentDate()}\x1b[0m`

  console.log(`${header}: ${message}`)
}

/**
 * @description Write to file
 * @param {Level} targetLevel
 * @param {string} message
 * @param {Error | undefined} error
 */
function writeToFile(targetLevel: Level, message: string): void {
  const logDir = configData.logDir
  const data: string = `{"level": "${
    targetLevel.value
  }", "message": "${message}", "timeStamp": "${getCurrentDate()}"}\r\n`

  if (!existsSync(logDir)) {
    log({
      levelName: 'debug',
      message:
        './logs directory does not exist. Creating one in root directory ...'
    })
    mkdirSync(logDir)
  }

  const options: FileOptions = {
    encoding: 'utf8',
    mode: 438
  }

  try {
    appendFileSync(
      `${logDir}/${targetLevel.value.toLowerCase()}.log`,
      data,
      options
    )
  } catch (error: any) {
    log({ levelName: 'debug', message: '', error })
  }
}

/**
 * @description Gets the logs of specified file
 * @param {string} fileName
 * @returns {Promise<JSON[]>} logs
 */
export async function readLog(fileName: string): Promise<JSON[]> {
  const logDir = './logs'

  return await new Promise((resolve, reject) => {
    const file = path.join(
      logDir,
      fileName?.includes('.') ? fileName : `${fileName}.log`
    )

    const lineReader = readLine.createInterface({
      input: createReadStream(file)
    })

    const logs: JSON[] = []

    lineReader.on('line', (line) => logs.push(JSON.parse(line)))
    lineReader.on('close', () => {
      log({
        levelName: 'access',
        message: `${fileName.toUpperCase()} logs have been accessed`
      })
      console.table(logs)
      resolve(logs)
    })

    lineReader.on('error', (error) => reject(error))
  })
}

/**
 * @description Gets the logs of specified file
 * @param {string} fileName
 * @returns {Promise<JSON[]>} logs
 */
export async function readJSONData(): Promise<JSON[]> {
  const logDir = './logs.json'

  return await new Promise((resolve, reject) => {
    const file = path.join(logDir)

    const lineReader = readLine.createInterface({
      input: createReadStream(file)
    })

    const logs: JSON[] = []

    lineReader.on('line', (line) => logs.push(JSON.parse(line)))
    lineReader.on('close', () => {
      resolve(logs)
    })

    lineReader.on('error', (error) => reject(error))
  })
}
