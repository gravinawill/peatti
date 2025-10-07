import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type Email } from '../../../value-objects/email.value-object'

export class EmailAlreadyInUseError extends CustomError {
  constructor(parameters: { email: Email }) {
    super({
      name: ERROR_NAME.EMAIL_ALREADY_IN_USE_ERROR,
      message: `Email already in use for customer ${parameters.email.value}`,
      status: STATUS_ERROR.CONFLICT,
      error: { email: parameters.email }
    })
  }
}
