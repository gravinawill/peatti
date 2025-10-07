import {
  DatabaseProviderMethods,
  extractErrorData,
  type ILoggerProvider,
  ProviderError,
  ProvidersNames,
  RepositoryError
} from '@peatti/domain'
import { authServerENV } from '@peatti/env'
import { makeLoggerProvider } from '@peatti/logger'
import { type Either, failure, success } from '@peatti/utils'

import { PrismaClient } from '../../../prisma/generated'

export class Database {
  private static instance: Database | undefined
  public prisma: PrismaClient
  private readonly loggerProvider: ILoggerProvider
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected'
  private connectionStartTime?: Date
  private reconnectionAttempts = 0
  private readonly maxReconnectionAttempts = 5

  private constructor() {
    this.loggerProvider = makeLoggerProvider()
    this.prisma = new PrismaClient({
      errorFormat: 'pretty',
      log: ['error', 'warn', 'info', 'query'],
      datasourceUrl: authServerENV.AUTH_SERVER_DATABASE_URL
    })
  }

  public static getInstance(): Database {
    Database.instance ??= new Database()
    return Database.instance
  }

  public async connect(): Promise<void> {
    try {
      if (this.connectionState === 'connected') return
      this.connectionState = 'connecting'
      this.loggerProvider.sendLogInfo({
        message: 'Attempting to connect to database...',
        data: { attempt: this.reconnectionAttempts + 1, maxAttempts: this.maxReconnectionAttempts }
      })
      await this.prisma.$connect()
      this.connectionState = 'connected'
      this.connectionStartTime = new Date()
      this.reconnectionAttempts = 0
      this.loggerProvider.sendLogInfo({
        message: 'Successfully connected to database',
        data: {
          connectionTime: this.connectionStartTime.toISOString(),
          environment: authServerENV.ENVIRONMENT
        }
      })
    } catch (error: unknown) {
      this.connectionState = 'error'
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'connect', name: 'database', externalName: 'prisma' }
      })
      this.loggerProvider.sendLogError({
        message: 'Failed to establish database connection',
        error: repositoryError
      })
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.connectionState === 'disconnected') return
      this.loggerProvider.sendLogInfo({ message: 'Disconnecting from database...' })
      await this.prisma.$disconnect()
      this.connectionState = 'disconnected'
      this.connectionStartTime = undefined
      this.loggerProvider.sendLogInfo({ message: 'Successfully disconnected from database' })
    } catch (error: unknown) {
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'disconnect', name: 'database', externalName: 'prisma' }
      })
      this.loggerProvider.sendLogError({ message: 'Failed to disconnect from database', error: repositoryError })
      throw error
    }
  }

  public async healthCheck(): Promise<
    Either<
      ProviderError,
      { connectionStatus: 'connected' | 'disconnected' | 'error'; uptime?: number; lastError?: string }
    >
  > {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      const uptime = this.connectionStartTime ? Date.now() - this.connectionStartTime.getTime() : undefined
      return success({ connectionStatus: 'connected', uptime, lastError: undefined })
    } catch (error: unknown) {
      const errorMessage = extractErrorData({ error })
      this.loggerProvider.sendLogError({
        message: 'Database health check failed',
        error: errorMessage
      })
      return failure(
        new ProviderError({
          error: errorMessage,
          provider: {
            name: ProvidersNames.DATABASE,
            method: DatabaseProviderMethods.HEALTH_CHECK,
            externalName: 'prisma'
          }
        })
      )
    }
  }

  public async gracefulShutdown(): Promise<void> {
    this.loggerProvider.sendLogInfo({ message: 'Initiating graceful database shutdown...' })
    await this.disconnect()
    this.loggerProvider.sendLogInfo({ message: 'Graceful database shutdown completed' })
    Database.instance = undefined
  }
}
