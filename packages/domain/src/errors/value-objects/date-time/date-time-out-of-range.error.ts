import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'

export class DateTimeOutOfRangeError extends CustomError {
  constructor(parameters: { dateTime: string | Date | number; minDate?: Date; maxDate?: Date }) {
    let rangeMessage = ''
    if (parameters.minDate && parameters.maxDate) {
      rangeMessage = ` (must be between ${parameters.minDate.toISOString()} and ${parameters.maxDate.toISOString()})`
    } else if (parameters.minDate) {
      rangeMessage = ` (must be after ${parameters.minDate.toISOString()})`
    } else if (parameters.maxDate) {
      rangeMessage = ` (must be before ${parameters.maxDate.toISOString()})`
    }

    const dateTimeString =
      parameters.dateTime instanceof Date ? parameters.dateTime.toISOString() : String(parameters.dateTime)

    super({
      name: ERROR_NAME.DATETIME_OUT_OF_RANGE_ERROR,
      message: `DateTime value is out of allowed range: ${dateTimeString}${rangeMessage}`,
      status: STATUS_ERROR.INVALID,
      error: {
        dateTime: parameters.dateTime,
        minDate: parameters.minDate,
        maxDate: parameters.maxDate
      }
    })
  }
}
