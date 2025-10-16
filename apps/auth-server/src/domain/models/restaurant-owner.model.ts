import {
  DateTime,
  type Email,
  type GenerateIDError,
  ID,
  InvalidRestaurantOwnerNameError,
  ModelName,
  type Password,
  type WhatsApp
} from '@peatti/domain'
import { type Either, failure, success } from '@peatti/utils'

enum RestaurantOwnerPendingType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  WHATSAPP_VERIFICATION = 'WHATSAPP_VERIFICATION'
}

export class RestaurantOwner {
  public readonly id: ID
  public name: string
  public email: Email
  public whatsApp: WhatsApp
  public password: Password
  public restaurantOwnerPendings: RestaurantOwnerPendingType[]
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  private constructor(parameters: {
    id: ID
    name: string
    email: Email
    whatsApp: WhatsApp
    password: Password
    restaurantOwnerPendings: RestaurantOwnerPendingType[]
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime | null
  }) {
    this.id = parameters.id
    this.name = parameters.name
    this.email = parameters.email
    this.whatsApp = parameters.whatsApp
    this.password = parameters.password
    this.restaurantOwnerPendings = parameters.restaurantOwnerPendings
    this.createdAt = parameters.createdAt
    this.updatedAt = parameters.updatedAt
    this.deletedAt = parameters.deletedAt
  }

  public static create(parameters: {
    name: string
    email: Email
    whatsApp: WhatsApp
    password: Password
  }): Either<GenerateIDError, { restaurantOwnerCreated: RestaurantOwner }> {
    const resultGenerateID = ID.generate({ modelName: ModelName.RESTAURANT_OWNER })
    if (resultGenerateID.isFailure()) return failure(resultGenerateID.value)
    const { idGenerated: restaurantOwnerID } = resultGenerateID.value
    const now = DateTime.now()
    return success({
      restaurantOwnerCreated: new RestaurantOwner({
        id: restaurantOwnerID,
        name: parameters.name,
        email: parameters.email,
        whatsApp: parameters.whatsApp,
        password: parameters.password,
        restaurantOwnerPendings: [
          RestaurantOwnerPendingType.EMAIL_VERIFICATION,
          RestaurantOwnerPendingType.WHATSAPP_VERIFICATION
        ],
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      })
    })
  }

  public static validateName(parameters: {
    name: string
    restaurantOwnerID: ID | null
  }): Either<InvalidRestaurantOwnerNameError, { nameValidated: string }> {
    if (parameters.name.length < 3) {
      return failure(
        new InvalidRestaurantOwnerNameError({
          restaurantOwnerName: parameters.name,
          restaurantOwnerID: parameters.restaurantOwnerID
        })
      )
    }
    return success({ nameValidated: parameters.name })
  }
}
