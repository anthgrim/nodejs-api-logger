export interface Level {
  value: string
  color: string
  writeToFile: boolean
}

export interface Levels {
  info: Level
  database: Level
  debug: Level
  access: Level
  error: Level
  fatal: Level
}

export interface FileOptions {
  encoding: BufferEncoding | any | undefined
  mode: number
}

export interface LogOptions {
  levelName: 'info' | 'database' | 'debug' | 'access' | 'error' | 'fatal'
  message: string
  error?: Error
}

export interface ConfigData {
  logDir: string
  dateFormat: string
  levels: Levels
}
