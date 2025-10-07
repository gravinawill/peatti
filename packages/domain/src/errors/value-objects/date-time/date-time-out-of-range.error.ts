import type { DateTime } from '../../../value-objects/date-time.value-object'

import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'

export class DateTimeOutOfRangeError extends CustomError {
  constructor(parameters: { dateTime: string | Date | number; minDate?: DateTime; maxDate?: DateTime }) {
    let rangeMessage = ''
    if (parameters.minDate && parameters.maxDate) {
      rangeMessage = ` (must be between ${parameters.minDate.value.toISOString()} and ${parameters.maxDate.value.toISOString()})`
    } else if (parameters.minDate) {
      rangeMessage = ` (must be after ${parameters.minDate.value.toISOString()})`
    } else if (parameters.maxDate) {
      rangeMessage = ` (must be before ${parameters.maxDate.value.toISOString()})`
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
