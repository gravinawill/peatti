import {
  type ISaveCustomersRepository,
  type SaveCustomersRepositoryDTO
} from '@contracts/repositories/customers/save.customers-repository'
import {
  type IValidateEmailCustomersRepository,
  type ValidateEmailCustomersRepositoryDTO
} from '@contracts/repositories/customers/validate-email.customers-repository'
import {
  type IValidateWhatsAppCustomersRepository,
  type ValidateWhatsAppCustomersRepositoryDTO
} from '@contracts/repositories/customers/validate-whatsapp.customers-repository'
import { Email, ID, type ILoggerProvider, ModelName, RepositoryError, WhatsApp } from '@peatti/domain'
import { failure, success } from '@peatti/utils'

import { type Database } from '../database'

export class CustomersPrismaRepository
  implements IValidateWhatsAppCustomersRepository, ISaveCustomersRepository, IValidateEmailCustomersRepository
{
  constructor(
    private readonly logger: ILoggerProvider,
    private readonly database: Database
  ) {}

  public async validateEmail(
    parameters: ValidateEmailCustomersRepositoryDTO.Parameters
  ): ValidateEmailCustomersRepositoryDTO.Result {
    const startTime = performance.now()
    try {
      const found = await this.database.prisma.customer.findUnique({
        where: { email: parameters.customer.email.value },
        select: { id: true, name: true, email: true }
      })

      if (found === null) return success({ foundCustomer: null })

      const resultValidateID = ID.validate({ id: found.id, modelName: ModelName.CUSTOMER })
      if (resultValidateID.isFailure()) return failure(resultValidateID.value)
      const { idValidated: customerID } = resultValidateID.value

      const resultValidateEmail = Email.validate({ email: found.email, customerID: customerID })
      if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value)
      const { emailValidated: customerEmail } = resultValidateEmail.value

      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'customers',
        method: 'validate email',
        isSuccess: true
      })
      return success({ foundCustomer: { id: customerID, name: found.name, email: customerEmail } })
    } catch (error: unknown) {
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'validate email', name: 'customers', externalName: 'prisma' }
      })
      this.logger.sendLogError({ message: repositoryError.message, error: repositoryError })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'customers',
        method: 'validate email',
        isSuccess: false
      })
      return failure(repositoryError)
    }
  }

  public async validateWhatsApp(
    parameters: ValidateWhatsAppCustomersRepositoryDTO.Parameters
  ): ValidateWhatsAppCustomersRepositoryDTO.Result {
    const startTime = performance.now()
    try {
      const found = await this.database.prisma.customer.findUnique({
        where: { whatsApp: parameters.customer.whatsApp.value },
        select: { id: true, name: true, whatsApp: true }
      })

      if (found === null) return success({ foundCustomer: null })

      const resultValidateID = ID.validate({ id: found.id, modelName: ModelName.CUSTOMER })
      if (resultValidateID.isFailure()) return failure(resultValidateID.value)
      const { idValidated: customerID } = resultValidateID.value

      const resultValidateWhatsApp = WhatsApp.validate({ whatsApp: found.whatsApp, customerID: customerID })
      if (resultValidateWhatsApp.isFailure()) return failure(resultValidateWhatsApp.value)
      const { whatsAppValidated: customerWhatsApp } = resultValidateWhatsApp.value

      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'customers',
        method: 'validate whatsapp',
        isSuccess: true
      })
      return success({ foundCustomer: { id: customerID, name: found.name, whatsApp: customerWhatsApp } })
    } catch (error: unknown) {
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'validate whatsapp', name: 'customers', externalName: 'prisma' }
      })
      this.logger.sendLogError({ message: repositoryError.message, error: repositoryError })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'customers',
        method: 'validate whatsapp',
        isSuccess: false
      })
      return failure(repositoryError)
    }
  }

  public async save(parameters: SaveCustomersRepositoryDTO.Parameters): SaveCustomersRepositoryDTO.Result {
    const startTime = performance.now()
    try {
      await this.database.prisma.$transaction(async (tx) => {
        await tx.customer.create({
          data: {
            createdAt: parameters.customer.createdAt.value,
            deletedAt: parameters.customer.deletedAt?.value,
            email: parameters.customer.email.value,
            id: parameters.customer.id.value,
            name: parameters.customer.name,
            updatedAt: parameters.customer.updatedAt.value,
            whatsApp: parameters.customer.whatsApp.value
          },
          select: { id: true }
        })
        await tx.customerPending.createMany({
          data: parameters.customer.customerPendings.map((pending) => ({
            type: pending,
            customerID: parameters.customer.id.value,
            createdAt: parameters.customer.createdAt.value,
            updatedAt: parameters.customer.updatedAt.value
          }))
        })
      })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'customers',
        method: 'save',
        isSuccess: true
      })
      return success(null)
    } catch (error: unknown) {
      const repositoryError = new RepositoryError({
        error,
        repository: { method: 'save', name: 'customers', externalName: 'prisma' }
      })
      this.logger.sendLogTimeRepository({
        runtimeInMs: performance.now() - startTime,
        repositoryName: 'customers',
        method: 'save',
        isSuccess: false
      })
      this.logger.sendLogError({ message: repositoryError.message, error: repositoryError })
      return failure(repositoryError)
    }
  }
}
