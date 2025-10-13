import { CustomError } from '../../shared/custom.error'
import { ERROR_NAME } from '../../shared/error-name'
import { STATUS_ERROR } from '../../shared/status-error'

export enum MessageBrokerErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  SEND_MESSAGE_FAILED = 'SEND_MESSAGE_FAILED',
  PARSE_MESSAGE_FAILED = 'PARSE_MESSAGE_FAILED',
  SCHEMA_VALIDATION_FAILED = 'SCHEMA_VALIDATION_FAILED',
  HANDLER_NOT_FOUND = 'HANDLER_NOT_FOUND',
  UNKNOWN_EVENT_TYPE = 'UNKNOWN_EVENT_TYPE',
  CONSUMER_ERROR = 'CONSUMER_ERROR',
  PRODUCER_ERROR = 'PRODUCER_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export class MessageBrokerError extends CustomError {
  constructor(parameters: { message: string; error: unknown; code: MessageBrokerErrorCode }) {
    super({
      name: ERROR_NAME.MESSAGE_BROKER_ERROR,
      message: parameters.message,
      status: STATUS_ERROR.MESSAGE_BROKER_ERROR,
      error:
        typeof parameters.error === 'object' && parameters.error !== null
          ? { ...parameters.error, code: parameters.code }
          : { details: parameters.error, code: parameters.code }
    })
  }
}
