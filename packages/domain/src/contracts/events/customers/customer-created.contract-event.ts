import { type CustomerPendingType } from '../../../models/customer.model'
import { type DateTime } from '../../../value-objects/date-time.value-object'
import { type Email } from '../../../value-objects/email.value-object'
import { type ID } from '../../../value-objects/id.value-object'
import { type WhatsApp } from '../../../value-objects/whatsapp.value-object'
import { type BaseEventContract } from '../events'

export const CUSTOMER_CREATED_EVENT_CONTRACT_TYPE = 'customers.customer-created' as const

export type CustomersCustomerCreatedPayload = {
  customerID: ID
  name: string
  email: Email
  whatsApp: WhatsApp
  customerPendings: CustomerPendingType[]
  createdAt: DateTime
  updatedAt: DateTime
}

export type CustomersCustomerCreatedEvent = BaseEventContract<CustomersCustomerCreatedPayload>
