import { type Either, failure, success } from '@peatti/utils'
import { v7 as randomUUID } from 'uuid'

import { UnknownEventContractNameError } from '../../errors/shared/unknown-event-contract-name.error'

import { RESTAURANT_OWNER_CREATED_EVENT_CONTRACT_NAME } from './restaurant-owners/restaurant-owner-created.event-contract'

export type BaseEventContract<Payload = unknown> = {
  payload: Payload
  timestamp: string
  id: string
}

export const EVENT_CONTRACT_NAMES = {
  RESTAURANT_OWNER_CREATED: RESTAURANT_OWNER_CREATED_EVENT_CONTRACT_NAME
} as const

export type EventContractName = (typeof EVENT_CONTRACT_NAMES)[keyof typeof EVENT_CONTRACT_NAMES]

export function selectEventContractType(parameters: {
  eventContractName: string
}): Either<UnknownEventContractNameError, { eventContractName: EventContractName }> {
  const contractName = Object.values(EVENT_CONTRACT_NAMES).find((name) => name === parameters.eventContractName)
  if (contractName) return success({ eventContractName: contractName })
  return failure(new UnknownEventContractNameError({ eventContractName: parameters.eventContractName }))
}

export function createEventContract<Payload>(parameters: {
  eventContractName: EventContractName
  payload: Payload
}): BaseEventContract<Payload> {
  return {
    payload: parameters.payload,
    timestamp: Date.now().toString(),
    id: parameters.eventContractName.replaceAll('.', '-') + '-' + randomUUID()
  }
}
