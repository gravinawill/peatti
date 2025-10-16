import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type ID } from '../../../value-objects/id.value-object'

export class InvalidRestaurantOwnerNameError extends CustomError {
  constructor(parameters: { restaurantOwnerName: string; restaurantOwnerID: ID | null }) {
    let message = `Invalid restaurant owner name for restaurant owner ${parameters.restaurantOwnerName}`
    if (parameters.restaurantOwnerID) message += ` with ID ${parameters.restaurantOwnerID.value}`
    super({
      name: ERROR_NAME.INVALID_RESTAURANT_OWNER_NAME_ERROR,
      message,
      status: STATUS_ERROR.INVALID,
      error: { restaurantOwnerName: parameters.restaurantOwnerName, restaurantOwnerID: parameters.restaurantOwnerID }
    })
  }
}
