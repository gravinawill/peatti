import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type ID } from '../../../value-objects/id.value-object'

export class InvalidWhatsappError extends CustomError {
  constructor(
    parameters: { whatsApp: string; customerID: ID | null } | { whatsApp: string; restaurantOwnerID: ID | null }
  ) {
    super({
      name: ERROR_NAME.INVALID_WHATSAPP_ERROR,
      message: `Invalid WhatsApp number for value object ${parameters.whatsApp}, customer ID: ${'customerID' in parameters ? parameters.customerID?.value : parameters.restaurantOwnerID?.value}`,
      status: STATUS_ERROR.INVALID,
      error: {
        whatsApp: parameters.whatsApp,
        ...('customerID' in parameters
          ? { customerID: parameters.customerID }
          : { restaurantOwnerID: parameters.restaurantOwnerID })
      }
    })
  }
}
