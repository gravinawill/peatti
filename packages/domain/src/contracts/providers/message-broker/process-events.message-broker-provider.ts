import { type Either } from '@peatti/utils'

import { type MessageBrokerError } from '../../../errors/shared/message-broker.error'
import { type MessageHandler } from '../../../shared/message-handler'
import { type EventServerName } from '../../events/events'

export namespace ProcessEventsMessageBrokerProviderDTO {
  export type Parameters<Payload> = Readonly<{
    serverName: EventServerName
    handlers: Array<MessageHandler<Payload>>
  }>

  export type ResultFailure = Readonly<MessageBrokerError>
  export type ResultSuccess = Readonly<null>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface IProcessEventsMessageBrokerProvider {
  processEvents<Payload>(
    parameters: ProcessEventsMessageBrokerProviderDTO.Parameters<Payload>
  ): ProcessEventsMessageBrokerProviderDTO.Result
}
