export type LoggerConfig = {
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  format?: 'json' | 'pretty'
  enableColors?: boolean
  enableTimestamp?: boolean
  enablePid?: boolean
  enableHostname?: boolean
  messageFormat?: string
  singleLine?: boolean
  hideObject?: boolean
  translateTime?: string
  levelFirst?: boolean
  ignore?: string
}

export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  level: 'info',
  format: 'pretty',
  enableColors: true,
  enableTimestamp: true,
  enablePid: false,
  enableHostname: false,
  messageFormat: '[{requestId}] {msg}',
  singleLine: false,
  hideObject: false,
  translateTime: 'yyyy-mm-dd HH:MM:ss Z',
  levelFirst: true,
  ignore: 'pid,hostname'
}
