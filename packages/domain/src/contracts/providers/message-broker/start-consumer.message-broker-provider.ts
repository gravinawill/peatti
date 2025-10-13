import { type Either } from '@peatti/utils'

import { type MessageBrokerError } from '../../../errors/shared/message-broker.error'
import { type EventServerName } from '../../events/events'

export namespace StartConsumerMessageBrokerProviderDTO {
  export type Parameters = Readonly<{
    serverName: EventServerName
    serviceName: string
  }>

  export type ResultFailure = Readonly<MessageBrokerError>
  export type ResultSuccess = Readonly<null>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface IStartConsumerMessageBrokerProvider {
  startConsumer(
    parameters: StartConsumerMessageBrokerProviderDTO.Parameters
  ): StartConsumerMessageBrokerProviderDTO.Result
}
