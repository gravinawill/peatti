import { type Either, failure, success } from '@peatti/utils'

import { EventContractTypeError } from '../../errors/shared/event-contract-type.error'
import { type GenerateIDError } from '../../errors/value-objects/id/generate-id.error'
import { ValueObjectName } from '../../shared/value-object-name'
import { DateTime } from '../../value-objects/date-time.value-object'
import { ID } from '../../value-objects/id.value-object'

import { CUSTOMER_CREATED_EVENT_CONTRACT_TYPE } from './customers/customer-created.contract-event'

export const EventContractType = {
  CUSTOMER_CREATED: CUSTOMER_CREATED_EVENT_CONTRACT_TYPE
} as const

export enum EventServerName {
  AUTH_SERVER = 'auth-server'
}

export type EventContractType = (typeof EventContractType)[keyof typeof EventContractType]

export type BaseEventContract<Payload = unknown> = Readonly<{
  payload: Payload
  createdAt: DateTime
  id: ID
}>

export function selectEventContractType(parameters: {
  eventContractType: string
}): Either<EventContractTypeError, { eventContractType: EventContractType }> {
  const contractType = Object.values(EventContractType).find((type) => type === parameters.eventContractType)
  if (contractType) return success({ eventContractType: contractType })
  return failure(new EventContractTypeError({ providedType: parameters.eventContractType }))
}

export function createEventContract<Payload>(parameters: {
  eventContractType: EventContractType
  payload: Payload
}): Either<GenerateIDError, BaseEventContract<Payload>> {
  const resultGenerateID = ID.generate({ valueObjectName: ValueObjectName.ID })
  if (resultGenerateID.isFailure()) return failure(resultGenerateID.value)
  const { idGenerated: eventID } = resultGenerateID.value
  eventID.addEventContractType({ eventContractType: parameters.eventContractType })
  return success({ payload: parameters.payload, createdAt: DateTime.now(), id: eventID })
}
