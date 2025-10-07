import { type Either, failure, success } from '@peatti/utils'

import { InvalidWhatsappError } from '../errors/value-objects/whatsapp/invalid-whatsapp.error'

import { type ID } from './id.value-object'

export class WhatsApp {
  public readonly value: string

  private constructor(parameters: { whatsApp: string }) {
    this.value = parameters.whatsApp.trim()
    Object.freeze(this)
  }

  public static validate(parameters: {
    whatsApp: string
    customerID: ID | null
  }): Either<InvalidWhatsappError, { whatsAppValidated: WhatsApp }> {
    const whatsApp = parameters.whatsApp.trim()
    if (!whatsApp || whatsApp.length === 0) {
      return failure(new InvalidWhatsappError({ whatsApp: parameters.whatsApp, customerID: parameters.customerID }))
    }
    const cleanedWhatsapp = whatsApp.replaceAll(/[^\d+]/g, '')
    if (cleanedWhatsapp.startsWith('+')) {
      if (!/^\+[1-9]\d{6,14}$/.test(cleanedWhatsapp)) {
        return failure(new InvalidWhatsappError({ whatsApp: parameters.whatsApp, customerID: parameters.customerID }))
      }
    } else {
      if (!/^[1-9]\d{6,14}$/.test(cleanedWhatsapp)) {
        return failure(new InvalidWhatsappError({ whatsApp: parameters.whatsApp, customerID: parameters.customerID }))
      }
    }
    return success({ whatsAppValidated: new WhatsApp({ whatsApp: cleanedWhatsapp }) })
  }

  public equals(parameters: { otherWhatsapp: WhatsApp }): boolean {
    if (!(parameters.otherWhatsapp instanceof WhatsApp)) return false
    return this.value.toLowerCase().trim() === parameters.otherWhatsapp.value.toLowerCase().trim()
  }
}
