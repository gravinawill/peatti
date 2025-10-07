import {
  DateTime,
  type Email,
  type GenerateIDError,
  ID,
  InvalidCustomerNameError,
  ModelName,
  type Password,
  type WhatsApp
} from '@peatti/domain'
import { type Either, failure, success } from '@peatti/utils'

enum CustomerPendingType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  WHATSAPP_VERIFICATION = 'WHATSAPP_VERIFICATION'
}

export class Customer {
  public readonly id: ID
  public name: string
  public email: Email
  public whatsApp: WhatsApp
  public password: Password
  public customerPendings: CustomerPendingType[]
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  private constructor(parameters: {
    id: ID
    name: string
    email: Email
    whatsApp: WhatsApp
    password: Password
    customerPendings: CustomerPendingType[]
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime | null
  }) {
    this.id = parameters.id
    this.name = parameters.name
    this.email = parameters.email
    this.whatsApp = parameters.whatsApp
    this.password = parameters.password
    this.customerPendings = parameters.customerPendings
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
    const now = DateTime.now()
    return success({
      customerCreated: new Customer({
        id: customerID,
        name: parameters.name,
        email: parameters.email,
        whatsApp: parameters.whatsApp,
        password: parameters.password,
        customerPendings: [CustomerPendingType.EMAIL_VERIFICATION, CustomerPendingType.WHATSAPP_VERIFICATION],
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
