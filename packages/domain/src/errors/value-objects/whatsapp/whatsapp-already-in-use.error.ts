import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type WhatsApp } from '../../../value-objects/whatsapp.value-object'

export class WhatsAppAlreadyInUseError extends CustomError {
  constructor(parameters: { whatsApp: WhatsApp }) {
    super({
      name: ERROR_NAME.WHATSAPP_ALREADY_IN_USE_ERROR,
      message: `WhatsApp already in use for customer ${parameters.whatsApp.value}`,
      status: STATUS_ERROR.CONFLICT,
      error: { whatsApp: parameters.whatsApp }
    })
  }
}
