import { type Either } from '@peatti/utils'

import { type MessageBrokerError } from '../../../errors/shared/message-broker.error'
import { type EventContractType } from '../../events/events'

export namespace SendEventMessageBrokerProviderDTO {
  export type Parameters<Payload> = Readonly<{
    eventContractType: EventContractType
    payload: Payload
  }>

  export type ResultFailure = Readonly<MessageBrokerError>
  export type ResultSuccess = Readonly<null>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface ISendEventMessageBrokerProvider {
  sendEvent<Payload>(
    parameters: SendEventMessageBrokerProviderDTO.Parameters<Payload>
  ): SendEventMessageBrokerProviderDTO.Result
}
