import { type ILoggerProvider } from '@peatti/domain'

import { PinoLoggerProvider } from './providers/logger.pino-provider'

export const makeLoggerProvider = (): ILoggerProvider => PinoLoggerProvider.getInstance()
