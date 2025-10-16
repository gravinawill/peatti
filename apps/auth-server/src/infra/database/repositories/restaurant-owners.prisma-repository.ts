import {
  type ISaveRestaurantOwnersRepository,
  type SaveRestaurantOwnersRepositoryDTO
} from '@contracts/repositories/restaurant-owners/save.restaurant-owners-repository'
import {
  type IValidateEmailRestaurantOwnersRepository,
  type ValidateEmailRestaurantOwnersRepositoryDTO
} from '@contracts/repositories/restaurant-owners/validate-email.restaurant-owners-repository'
import {
  type IValidateWhatsAppRestaurantOwnersRepository,
  type ValidateWhatsAppRestaurantOwnersRepositoryDTO
} from '@contracts/repositories/restaurant-owners/validate-whatsapp.restaurant-owners-repository'
import { Email, ID, type ILoggerProvider, ModelName, RepositoryError, WhatsApp } from '@peatti/domain'
import { failure, success } from '@peatti/utils'

import { type Database } from '../database'

export class RestaurantOwnersPrismaRepository
  implements
    IValidateWhatsAppRestaurantOwnersRepository,
    ISaveRestaurantOwnersRepository,
    IValidateEmailRestaurantOwnersRepository
{
  constructor(
    private readonly logger: ILoggerProvider,
    private readonly database: Database
  ) {}

  public async validateEmail(
    parameters: ValidateEmailRestaurantOwnersRepositoryDTO.Parameters
  ): ValidateEmailRestaurantOwnersRepositoryDTO.Result {
    const startTime = performance.now()
    try {
      const found = await this.database.prisma.restaurantOwner.findUnique({
        where: { email: parameters.restaurantOwner.email.value },
        select: { id: true, name: true, email: true }
      })

      if (found === null) {
        return success({ foundRestaurantOwner: null })
      }

      const resultValidateID = ID.validate({ id: found.id, modelName: ModelName.RESTAURANT_OWNER })
      if (resultValidateID.isFailure()) return failure(resultValidateID.value)
      const { idValidated: restaurantOwnerID } = resultValidateID.value

      const resultValidateEmail = Email.validate({ email: found.email, restaurantOwnerID })
      if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value)
      const { emailValidated: restaurantOwnerEmail } = resultValidateEmail.value

      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'restaurant owners',
        method: 'validate email',
        isSuccess: true
      })

      return success({
        foundRestaurantOwner: {
          id: restaurantOwnerID,
          name: found.name,
          email: restaurantOwnerEmail
        }
      })
    } catch (error: unknown) {
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'validate email', name: 'restaurant owners', externalName: 'prisma' }
      })
      this.logger.sendLogError({ message: repositoryError.message, error: repositoryError })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'restaurant owners',
        method: 'validate email',
        isSuccess: false
      })
      return failure(repositoryError)
    }
  }

  public async validateWhatsApp(
    parameters: ValidateWhatsAppRestaurantOwnersRepositoryDTO.Parameters
  ): ValidateWhatsAppRestaurantOwnersRepositoryDTO.Result {
    const startTime = performance.now()
    try {
      const found = await this.database.prisma.restaurantOwner.findUnique({
        where: { whatsApp: parameters.restaurantOwner.whatsApp.value },
        select: { id: true, name: true, whatsApp: true }
      })

      if (found === null) {
        return success({ foundRestaurantOwner: null })
      }

      const resultValidateID = ID.validate({ id: found.id, modelName: ModelName.RESTAURANT_OWNER })
      if (resultValidateID.isFailure()) return failure(resultValidateID.value)
      const { idValidated: restaurantOwnerID } = resultValidateID.value

      const resultValidateWhatsApp = WhatsApp.validate({ whatsApp: found.whatsApp, restaurantOwnerID })
      if (resultValidateWhatsApp.isFailure()) return failure(resultValidateWhatsApp.value)
      const { whatsAppValidated: restaurantOwnerWhatsApp } = resultValidateWhatsApp.value

      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'restaurant owners',
        method: 'validate whatsapp',
        isSuccess: true
      })

      return success({
        foundRestaurantOwner: {
          id: restaurantOwnerID,
          name: found.name,
          whatsApp: restaurantOwnerWhatsApp
        }
      })
    } catch (error: unknown) {
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'validate whatsapp', name: 'restaurant owners', externalName: 'prisma' }
      })
      this.logger.sendLogError({ message: repositoryError.message, error: repositoryError })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'restaurant owners',
        method: 'validate whatsapp',
        isSuccess: false
      })
      return failure(repositoryError)
    }
  }

  public async save(
    parameters: SaveRestaurantOwnersRepositoryDTO.Parameters
  ): SaveRestaurantOwnersRepositoryDTO.Result {
    const startTime = performance.now()
    try {
      await this.database.prisma.$transaction(async (tx) => {
        await tx.restaurantOwner.create({
          data: {
            id: parameters.restaurantOwner.id.value,
            name: parameters.restaurantOwner.name,
            email: parameters.restaurantOwner.email.value,
            whatsApp: parameters.restaurantOwner.whatsApp.value,
            createdAt: parameters.restaurantOwner.createdAt.value,
            updatedAt: parameters.restaurantOwner.updatedAt.value,
            passwordEncrypted: parameters.restaurantOwner.password.value,
            deletedAt: parameters.restaurantOwner.deletedAt?.value
          },
          select: { id: true }
        })
      })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'restaurant owners',
        method: 'save',
        isSuccess: true
      })
      return success(null)
    } catch (error: unknown) {
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'save', name: 'restaurant owners', externalName: 'prisma' }
      })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'restaurant owners',
        method: 'save',
        isSuccess: false
      })
      this.logger.sendLogError({ message: repositoryError.message, error: repositoryError })
      return failure(repositoryError)
    }
  }
}
