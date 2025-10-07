import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'

export class InvalidDateTimeError extends CustomError {
  constructor(parameters: { dateTime: string | Date | number }) {
    super({
      name: ERROR_NAME.INVALID_DATETIME_ERROR,
      message: `Invalid DateTime value for value object: ${parameters.dateTime.toString()}`,
      status: STATUS_ERROR.INVALID,
      error: { dateTime: parameters.dateTime }
    })
  }
}
