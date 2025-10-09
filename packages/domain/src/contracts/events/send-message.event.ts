import { type Either } from '@peatti/utils'

import { type ProviderError } from '../../errors/shared/provider.error'

import { type EventContractType } from './events'

export namespace SendMessageEventProviderDTO {
  export type Parameters<Payload> = Readonly<{
    eventContractType: EventContractType
    payload: Payload
  }>
  //TODO: refactor result type
  export type Result = Promise<Either<ProviderError, null>>
}

export interface ISendMessageEventProvider {
  sendMessage<Payload>(parameters: SendMessageEventProviderDTO.Parameters<Payload>): SendMessageEventProviderDTO.Result
}
