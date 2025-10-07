import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type ID } from '../../../value-objects/id.value-object'

export class InvalidCustomerNameError extends CustomError {
  constructor(parameters: { customerName: string; customerID: ID | null }) {
    let message = `Invalid customer name for customer ${parameters.customerName}`
    if (parameters.customerID) message += ` with ID ${parameters.customerID.value}`
    super({
      name: ERROR_NAME.INVALID_CUSTOMER_NAME_ERROR,
      message,
      status: STATUS_ERROR.INVALID,
      error: { customerName: parameters.customerName, customerID: parameters.customerID }
    })
  }
}
