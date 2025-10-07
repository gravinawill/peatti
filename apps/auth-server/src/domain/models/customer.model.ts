import {
  type Email,
  type GenerateIDError,
  ID,
  InvalidCustomerNameError,
  ModelName,
  type Password,
  type WhatsApp
} from '@peatti/domain'
import { type Either, failure, success } from '@peatti/utils'

export class Customer {
  public readonly id: ID
  public name: string
  public email: Email
  public isEmailVerified: boolean
  public whatsApp: WhatsApp
  public isWhatsAppVerified: boolean
  public password: Password
  public readonly createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  private constructor(parameters: {
    id: ID
    name: string
    email: Email
    isEmailVerified: boolean
    whatsApp: WhatsApp
    isWhatsAppVerified: boolean
    password: Password
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
  }) {
    this.id = parameters.id
    this.name = parameters.name
    this.email = parameters.email
    this.isEmailVerified = parameters.isEmailVerified
    this.whatsApp = parameters.whatsApp
    this.isWhatsAppVerified = parameters.isWhatsAppVerified
    this.password = parameters.password
    this.createdAt = parameters.createdAt
    this.updatedAt = parameters.updatedAt
    this.deletedAt = parameters.deletedAt
  }

  public static create(parameters: {
    name: string
    email: Email
    whatsApp: WhatsApp
    password: Password
  }): Either<GenerateIDError, { customerCreated: Customer }> {
    const resultGenerateID = ID.generate({ modelName: ModelName.CUSTOMER })
    if (resultGenerateID.isFailure()) return failure(resultGenerateID.value)
    const { idGenerated: customerID } = resultGenerateID.value
    const now = new Date()
    return success({
      customerCreated: new Customer({
        id: customerID,
        name: parameters.name,
        email: parameters.email,
        isEmailVerified: false,
        whatsApp: parameters.whatsApp,
        isWhatsAppVerified: false,
        password: parameters.password,
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      })
    })
  }

  public static validateName(parameters: {
    name: string
    customerID: ID | null
  }): Either<InvalidCustomerNameError, { nameValidated: string }> {
    if (parameters.name.length < 3) {
      return failure(new InvalidCustomerNameError({ customerName: parameters.name, customerID: parameters.customerID }))
    }
    return success({ nameValidated: parameters.name })
  }
}
