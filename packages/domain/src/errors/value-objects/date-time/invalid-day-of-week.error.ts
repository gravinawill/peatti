import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'

export class InvalidDayOfWeekError extends CustomError {
  constructor(parameters: { dayOfWeek: number | string }) {
    const message =
      typeof parameters.dayOfWeek === 'string'
        ? `Invalid day of week: ${parameters.dayOfWeek}. Expected string representation of a day of the week.`
        : `Invalid day of week: ${String(parameters.dayOfWeek)}. Expected number between 0 (Sunday) and 6 (Saturday).`

    super({
      name: ERROR_NAME.INVALID_DAY_OF_WEEK_ERROR,
      message,
      status: STATUS_ERROR.INVALID,
      error: { dayOfWeek: parameters.dayOfWeek }
    })
  }
}
