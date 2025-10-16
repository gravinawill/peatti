import { type Either, failure, success } from '@peatti/utils'

import { InvalidWhatsappError } from '../errors/value-objects/whatsapp/invalid-whatsapp.error'

import { type ID } from './id.value-object'

type WhatsAppValidationParams =
  | { whatsApp: string; customerID: ID | null }
  | { whatsApp: string; restaurantOwnerID: ID | null }

export class WhatsApp {
  public readonly value: string

  private constructor(parameters: { whatsApp: string }) {
    this.value = parameters.whatsApp.trim()
    Object.freeze(this)
  }

  public static validate(
    parameters: WhatsAppValidationParams
  ): Either<InvalidWhatsappError, { whatsAppValidated: WhatsApp }> {
    const { whatsApp } = parameters
    const trimmedWhatsapp = whatsApp.trim()
    if (!trimmedWhatsapp) {
      return failure(
        new InvalidWhatsappError({
          whatsApp: parameters.whatsApp,
          ...('customerID' in parameters
            ? { customerID: parameters.customerID }
            : { restaurantOwnerID: parameters.restaurantOwnerID })
        })
      )
    }

    const cleanedWhatsapp = trimmedWhatsapp.replaceAll(/[^\d+]/g, '')
    const isInternational = cleanedWhatsapp.startsWith('+')
    const isValid = isInternational
      ? /^\+[1-9]\d{6,14}$/.test(cleanedWhatsapp)
      : /^[1-9]\d{6,14}$/.test(cleanedWhatsapp)

    if (!isValid) return failure(new InvalidWhatsappError({ ...parameters, whatsApp }))

    return success({ whatsAppValidated: new WhatsApp({ whatsApp: cleanedWhatsapp }) })
  }

  public equals({ otherWhatsapp }: { otherWhatsapp: WhatsApp }): boolean {
    if (!(otherWhatsapp instanceof WhatsApp)) return false
    return this.value.toLowerCase().trim() === otherWhatsapp.value.toLowerCase().trim()
  }
}
