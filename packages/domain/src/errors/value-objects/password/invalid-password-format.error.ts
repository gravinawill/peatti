import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'

export class InvalidPasswordFormatError extends CustomError {
  constructor() {
    super({
      name: ERROR_NAME.INVALID_PASSWORD_FORMAT_ERROR,
      message: `The password is invalid format`,
      status: STATUS_ERROR.INVALID,
      error: undefined
    })
  }
}
