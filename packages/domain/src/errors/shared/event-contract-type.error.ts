import { EventContractType } from '../../contracts/events/events'
import { CustomError } from '../../shared/custom.error'
import { ERROR_NAME } from '../../shared/error-name'
import { STATUS_ERROR } from '../../shared/status-error'

export class EventContractTypeError extends CustomError {
  constructor(parameters: { providedType: string }) {
    super({
      name: ERROR_NAME.EVENT_CONTRACT_TYPE_ERROR,
      message: `Unknown event contract type: ${parameters.providedType}. Valid types are: ${Object.values(EventContractType).join(', ')}`,
      status: STATUS_ERROR.INVALID,
      error: { providedType: parameters.providedType }
    })
  }
}
