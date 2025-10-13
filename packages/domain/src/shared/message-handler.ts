import { type Either } from '@peatti/utils'
import { type z } from 'zod'

import { type EventContractType } from '../contracts/events/events'
import { type MessageBrokerError } from '../errors/shared/message-broker.error'

export type HandlerMessageBroker<Payload> = (
  parameters: MessageHandlerParameters<Payload>
) => Promise<Either<MessageBrokerError, null>>

export type MessageHandler<Payload> = Readonly<{
  eventContractType: EventContractType
  handler: HandlerMessageBroker<Payload>
  schema: z.ZodType<Payload>
}>

export type MessageHandlerParameters<Payload> = Readonly<{
  eventContractType: EventContractType
  payload: Payload
}>
