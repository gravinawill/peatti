import { type ISaveCustomersRepository } from '@contracts/repositories/customers/save.customers-repository'
import { type IValidateEmailCustomersRepository } from '@contracts/repositories/customers/validate-email.customers-repository'
import { type IValidateWhatsAppCustomersRepository } from '@contracts/repositories/customers/validate-whatsapp.customers-repository'
import { Customer } from '@models/customer.model'
import {
  Email,
  EmailAlreadyInUseError,
  type IEncryptPasswordCryptoProvider,
  type ILoggerProvider,
  Password,
  UseCase,
  WhatsApp,
  WhatsAppAlreadyInUseError
} from '@peatti/domain'
import { type CustomError } from '@peatti/domain/src/shared/custom.error'
import { type Either, failure, success } from '@peatti/utils'

export namespace SignUpCustomerUseCaseDTO {
  export type Parameters = Readonly<{
    customer: {
      name: string
      email: string
      whatsApp: string
      password: string
    }
  }>
  export type ResultFailure = Readonly<CustomError>
  export type ResultSuccess = Readonly<{ customer: Customer }>
  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export class SignUpCustomerUseCase extends UseCase<
  SignUpCustomerUseCaseDTO.Parameters,
  SignUpCustomerUseCaseDTO.ResultFailure,
  SignUpCustomerUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ILoggerProvider,
    private readonly customersRepository: IValidateWhatsAppCustomersRepository &
      IValidateEmailCustomersRepository &
      ISaveCustomersRepository,
    private readonly cryptoProvider: IEncryptPasswordCryptoProvider
  ) {
    super(loggerProvider)
  }

  protected async performOperation(parameters: SignUpCustomerUseCaseDTO.Parameters): SignUpCustomerUseCaseDTO.Result {
    const resultValidateName = Customer.validateName({ name: parameters.customer.name, customerID: null })
    if (resultValidateName.isFailure()) return failure(resultValidateName.value)
    const { nameValidated } = resultValidateName.value

    const resultValidatePassword = Password.validateDecryptedPassword({ password: parameters.customer.password })
    if (resultValidatePassword.isFailure()) return failure(resultValidatePassword.value)
    const { passwordValidated } = resultValidatePassword.value

    const resultValidateWhatsApp = WhatsApp.validate({ whatsApp: parameters.customer.whatsApp, customerID: null })
    if (resultValidateWhatsApp.isFailure()) return failure(resultValidateWhatsApp.value)
    const { whatsAppValidated } = resultValidateWhatsApp.value

    const resultValidateIfExistsWhatsApp = await this.customersRepository.validateWhatsApp({
      customer: { whatsApp: whatsAppValidated }
    })
    if (resultValidateIfExistsWhatsApp.isFailure()) return failure(resultValidateIfExistsWhatsApp.value)
    if (resultValidateIfExistsWhatsApp.value.foundCustomer) {
      return failure(new WhatsAppAlreadyInUseError({ whatsApp: whatsAppValidated }))
    }

    const resultValidateEmail = Email.validate({ email: parameters.customer.email, customerID: null })
    if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value)
    const { emailValidated } = resultValidateEmail.value

    const resultValidateIfExistsEmail = await this.customersRepository.validateEmail({
      customer: { email: emailValidated }
    })
    if (resultValidateIfExistsEmail.isFailure()) return failure(resultValidateIfExistsEmail.value)
    if (resultValidateIfExistsEmail.value.foundCustomer) {
      return failure(new EmailAlreadyInUseError({ email: emailValidated }))
    }

    const resultEncryptPassword = await this.cryptoProvider.encryptPassword({ password: passwordValidated })
    if (resultEncryptPassword.isFailure()) return failure(resultEncryptPassword.value)
    const { passwordEncrypted } = resultEncryptPassword.value

    const resultCreateCustomer = Customer.create({
      name: nameValidated,
      email: emailValidated,
      whatsApp: whatsAppValidated,
      password: passwordEncrypted
    })
    if (resultCreateCustomer.isFailure()) return failure(resultCreateCustomer.value)
    const { customerCreated } = resultCreateCustomer.value

    const resultSaveCustomer = await this.customersRepository.save({ customer: customerCreated })
    if (resultSaveCustomer.isFailure()) return failure(resultSaveCustomer.value)

    return success({ customer: customerCreated })
  }
}
