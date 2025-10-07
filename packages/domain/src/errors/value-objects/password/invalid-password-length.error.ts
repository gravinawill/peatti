import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'

export class InvalidPasswordLengthError extends CustomError {
  constructor(parameters: { passwordLength: number }) {
    super({
      name: ERROR_NAME.INVALID_PASSWORD_LENGTH_ERROR,
      message: `Invalid password length: ${parameters.passwordLength}`,
      status: STATUS_ERROR.INVALID,
      error: undefined
    })
  }
}
