import { type BaseEventContract } from '../base.event-contract'

export const RESTAURANT_OWNER_CREATED_EVENT_CONTRACT_NAME = 'restaurant-owners.created' as const

export type RestaurantOwnerCreatedEventPayload = {
  restaurantOwnerID: string
  name: string
  email: string
  whatsApp: string
  createdAtISO: string
  updatedAtISO: string
  deletedAtISO: string | null
}

export type RestaurantOwnerCreatedEventContract = BaseEventContract<RestaurantOwnerCreatedEventPayload>
