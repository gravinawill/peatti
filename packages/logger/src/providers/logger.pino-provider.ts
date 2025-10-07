import {
  type ILoggerProvider,
  type SendLogErrorLoggerProviderDTO,
  type SendLogEventConsumerLoggerProviderDTO,
  type SendLogInfoLoggerProviderDTO,
  type SendLogTimeControllerLoggerProviderDTO,
  type SendLogTimeUseCaseLoggerProviderDTO,
  type SendLogWarnLoggerProviderDTO
} from '@peatti/domain'
import pino, { type Bindings, type Logger, type LoggerOptions } from 'pino'

export class PinoLoggerProvider implements ILoggerProvider {
  private static instance: PinoLoggerProvider | null = null
  private readonly logger: Logger

  constructor() {
    this.logger = pino(this.getDefaultOptions())
  }

  private getDefaultOptions(): LoggerOptions {
    return {
      level: 'info',
      ...(process.env.LOG_FORMAT === 'json'
        ? {
            formatters: {
              level: (label: string) => ({ level: label }),
              bindings: (bindings: Bindings) => ({
                pid: bindings.pid,
                hostname: bindings.hostname
              })
            }
          }
        : {
            transport: {
              targets: [
                {
                  target: 'pino-pretty',
                  level: 'info',
                  options: {
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    messageFormat: '[{requestId}] {msg}',
                    singleLine: false,
                    hideObject: false
                  }
                }
              ]
            }
          })
    }
  }

  public static getInstance(): PinoLoggerProvider {
    PinoLoggerProvider.instance ??= new PinoLoggerProvider()
    return PinoLoggerProvider.instance
  }

  // eslint-disable-next-line sonarjs/no-invariant-returns -- this is a valid return
  public sendLogWarn(parameters: SendLogWarnLoggerProviderDTO.Parameters): SendLogWarnLoggerProviderDTO.Result {
    try {
      this.logger.warn(this.formatLogData(parameters))
      return null
    } catch (error) {
      // Fallback to console if logger fails
      console.warn('Logger failed:', error)
      console.warn('Original log data:', parameters)
      return null
    }
  }

  private formatLogData(data: Record<string, unknown>) {
    try {
      const { message, ...rest } = data

      const flattenedData = this.flattenObject(rest)

      return {
        ...flattenedData,
        msg: message,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        msg: 'Failed to format log data',
        originalData: data,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }
    }
  }

  private flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const flattened: Record<string, unknown> = {}

    try {
      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value === null || value === undefined) {
          flattened[newKey] = value
        } else if (value instanceof Date) {
          flattened[newKey] = value.toISOString()
        } else if (Array.isArray(value)) {
          flattened[newKey] = value
        } else if (typeof value === 'object') {
          Object.assign(flattened, this.flattenObject(value as Record<string, unknown>, newKey))
        } else {
          flattened[newKey] = value
        }
      }
    } catch {
      flattened[prefix || 'data'] = obj
    }

    return flattened
  }

  // eslint-disable-next-line sonarjs/no-invariant-returns -- this is a valid return
  public sendLogInfo(parameters: SendLogInfoLoggerProviderDTO.Parameters): SendLogInfoLoggerProviderDTO.Result {
    try {
      this.logger.info(this.formatLogData(parameters))
      return null
    } catch (error) {
      console.info('Logger failed:', error)
      console.info('Original log data:', parameters)
      return null
    }
  }

  // eslint-disable-next-line sonarjs/no-invariant-returns -- this is a valid return
  public sendLogError(parameters: SendLogErrorLoggerProviderDTO.Parameters): SendLogErrorLoggerProviderDTO.Result {
    try {
      const { error, ...otherParams } = parameters
      const errorInfo = this.extractErrorInfo(error)

      const logData = {
        ...this.formatLogData(otherParams),
        error: errorInfo
      }

      this.logger.error(logData)
      return null
    } catch (loggerError) {
      console.error('Logger failed:', loggerError)
      console.error('Original log data:', parameters)
      return null
    }
  }

  private extractErrorInfo(error: unknown): {
    message: string
    type: string
    stack?: string
  } {
    if (error instanceof Error) {
      return {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as { message: string; name?: string; stack?: string }
      return {
        message: errorObj.message,
        type: errorObj.name ?? 'UnknownError',
        stack: errorObj.stack
      }
    }

    let message: string
    if (error) {
      message = typeof error === 'string' ? error : JSON.stringify(error)
    } else {
      message = 'Unknown error occurred'
    }

    return {
      message,
      type: 'UnknownError'
    }
  }

  // eslint-disable-next-line sonarjs/no-invariant-returns, sonarjs/no-identical-functions -- this is a valid return
  public sendLogTimeController(
    parameters: SendLogTimeControllerLoggerProviderDTO.Parameters
  ): SendLogTimeControllerLoggerProviderDTO.Result {
    try {
      this.logger.info(this.formatLogData(parameters))
      return null
    } catch (error) {
      console.info('Logger failed:', error)
      console.info('Original log data:', parameters)
      return null
    }
  }

  // eslint-disable-next-line sonarjs/no-invariant-returns, sonarjs/no-identical-functions -- this is a valid return
  public sendLogTimeUseCase(
    parameters: SendLogTimeUseCaseLoggerProviderDTO.Parameters
  ): SendLogTimeUseCaseLoggerProviderDTO.Result {
    try {
      this.logger.info(this.formatLogData(parameters))
      return null
    } catch (error) {
      console.info('Logger failed:', error)
      console.info('Original log data:', parameters)
      return null
    }
  }

  // eslint-disable-next-line sonarjs/no-invariant-returns -- this is a valid return
  public sendLogTimeRepository(
    parameters: Readonly<{ runtimeInMs: number; repositoryName: string; method: string; isSuccess: boolean }>
  ): null {
    try {
      this.logger.info(
        {
          type: 'repository_timing',
          repository: parameters.repositoryName,
          method: parameters.method,
          runtimeInMs: parameters.runtimeInMs,
          isSuccess: parameters.isSuccess
        },
        `Repository [${parameters.repositoryName}] method [${parameters.method}] executed in ${parameters.runtimeInMs}ms (success: ${parameters.isSuccess})`
      )
      return null
    } catch (error) {
      console.info('Logger failed:', error)
      console.info('Original log data:', parameters)
      return null
    }
  }

  // eslint-disable-next-line sonarjs/no-invariant-returns, sonarjs/no-identical-functions -- this is a valid return
  public sendLogEventConsumer(
    parameters: SendLogEventConsumerLoggerProviderDTO.Parameters
  ): SendLogEventConsumerLoggerProviderDTO.Result {
    try {
      this.logger.info(this.formatLogData(parameters))
      return null
    } catch (error) {
      console.info('Logger failed:', error)
      console.info('Original log data:', parameters)
      return null
    }
  }
}
