import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type ID } from '../../../value-objects/id.value-object'

export class InvalidEmailError extends CustomError {
  constructor(parameters: { email: string; customerID: ID | null }) {
    let message = `Invalid email for value object ${parameters.email}`
    if (parameters.customerID) message += ` with ID ${parameters.customerID.value}`
    super({
      name: ERROR_NAME.INVALID_EMAIL_ERROR,
      message,
      status: STATUS_ERROR.INVALID,
      error: { email: parameters.email, customerID: parameters.customerID }
    })
  }
}
