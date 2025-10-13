import { type Either } from '@peatti/utils'

import { type MessageBrokerError } from '../../../errors/shared/message-broker.error'
import { type EventServerName } from '../../events/events'

export namespace CheckHealthMessageBrokerProviderDTO {
  export type HealthCheckResult = Readonly<{
    isHealthy: boolean
    details: {
      consumer?: {
        connected: boolean
        subscriptions: string[]
      }
      producer?: {
        connected: boolean
      }
      lastError?: string
    }
  }>

  export type Parameters = Readonly<{
    serverName: EventServerName
  }>

  export type ResultFailure = Readonly<MessageBrokerError>
  export type ResultSuccess = Readonly<{ healthCheckResult: HealthCheckResult }>

  export type Result = Either<ResultFailure, ResultSuccess>
}

export interface ICheckHealthMessageBrokerProvider {
  checkHealth(parameters: CheckHealthMessageBrokerProviderDTO.Parameters): CheckHealthMessageBrokerProviderDTO.Result
}
