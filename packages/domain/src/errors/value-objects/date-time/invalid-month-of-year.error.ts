import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'

export class InvalidMonthOfYearError extends CustomError {
  constructor(parameters: { monthOfYear: number | string }) {
    const message =
      typeof parameters.monthOfYear === 'string'
        ? `Invalid month of year: ${parameters.monthOfYear}. Expected string representation of a month.`
        : `Invalid month of year: ${String(parameters.monthOfYear)}. Expected number between 0 (January) and 11 (December).`

    super({
      name: ERROR_NAME.INVALID_MONTH_OF_YEAR_ERROR,
      message,
      status: STATUS_ERROR.INVALID,
      error: { monthOfYear: parameters.monthOfYear }
    })
  }
}
