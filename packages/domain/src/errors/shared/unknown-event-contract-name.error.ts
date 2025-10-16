import { EVENT_CONTRACT_NAMES } from '../../contracts/events/base.event-contract'
import { CustomError } from '../../shared/custom.error'
import { ERROR_NAME } from '../../shared/error-name'
import { STATUS_ERROR } from '../../shared/status-error'

export class UnknownEventContractNameError extends CustomError {
  constructor(parameters: { eventContractName: string }) {
    super({
      name: ERROR_NAME.UNKNOWN_EVENT_CONTRACT_NAME_ERROR,
      message: `Unknown event contract name: ${parameters.eventContractName}. Valid event contract names are: ${Object.values(EVENT_CONTRACT_NAMES).join(', ')}`,
      status: STATUS_ERROR.INTERNAL_ERROR,
      error: undefined
    })
  }
}
