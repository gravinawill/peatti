import { type ISaveRestaurantOwnersRepository } from '@contracts/repositories/restaurant-owners/save.restaurant-owners-repository'
import { type IValidateEmailRestaurantOwnersRepository } from '@contracts/repositories/restaurant-owners/validate-email.restaurant-owners-repository'
import { type IValidateWhatsAppRestaurantOwnersRepository } from '@contracts/repositories/restaurant-owners/validate-whatsapp.restaurant-owners-repository'
import { RestaurantOwner } from '@models/restaurant-owner.model'
import {
  type CustomError,
  Email,
  EmailAlreadyInUseError,
  type IEncryptPasswordCryptoProvider,
  type ILoggerProvider,
  Password,
  UseCase,
  WhatsApp,
  WhatsAppAlreadyInUseError
} from '@peatti/domain'
import { type Either, failure, success } from '@peatti/utils'

export namespace SignUpRestaurantOwnerUseCaseDTO {
  export type Parameters = Readonly<{
    restaurantOwner: {
      name: string
      email: string
      whatsApp: string
      password: string
    }
  }>
  export type ResultFailure = Readonly<CustomError>
  export type ResultSuccess = Readonly<{ restaurantOwner: RestaurantOwner }>
  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export class SignUpRestaurantOwnerUseCase extends UseCase<
  SignUpRestaurantOwnerUseCaseDTO.Parameters,
  SignUpRestaurantOwnerUseCaseDTO.ResultFailure,
  SignUpRestaurantOwnerUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ILoggerProvider,
    private readonly restaurantOwnersRepository: IValidateWhatsAppRestaurantOwnersRepository &
      IValidateEmailRestaurantOwnersRepository &
      ISaveRestaurantOwnersRepository,
    private readonly cryptoProvider: IEncryptPasswordCryptoProvider
  ) {
    super(loggerProvider)
  }

  protected async performOperation(
    parameters: SignUpRestaurantOwnerUseCaseDTO.Parameters
  ): SignUpRestaurantOwnerUseCaseDTO.Result {
    const resultValidateName = RestaurantOwner.validateName({
      name: parameters.restaurantOwner.name,
      restaurantOwnerID: null
    })
    if (resultValidateName.isFailure()) return failure(resultValidateName.value)
    const { nameValidated } = resultValidateName.value

    const resultValidatePassword = Password.validateDecryptedPassword({ password: parameters.restaurantOwner.password })
    if (resultValidatePassword.isFailure()) return failure(resultValidatePassword.value)
    const { passwordValidated } = resultValidatePassword.value

    const resultValidateWhatsApp = WhatsApp.validate({
      whatsApp: parameters.restaurantOwner.whatsApp,
      restaurantOwnerID: null
    })
    if (resultValidateWhatsApp.isFailure()) return failure(resultValidateWhatsApp.value)
    const { whatsAppValidated } = resultValidateWhatsApp.value

    const resultValidateIfExistsWhatsApp = await this.restaurantOwnersRepository.validateWhatsApp({
      restaurantOwner: { whatsApp: whatsAppValidated }
    })
    if (resultValidateIfExistsWhatsApp.isFailure()) return failure(resultValidateIfExistsWhatsApp.value)
    if (resultValidateIfExistsWhatsApp.value.foundRestaurantOwner) {
      return failure(new WhatsAppAlreadyInUseError({ whatsApp: whatsAppValidated }))
    }

    const resultValidateEmail = Email.validate({
      email: parameters.restaurantOwner.email,
      restaurantOwnerID: null
    })
    if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value)
    const { emailValidated } = resultValidateEmail.value

    const resultValidateIfExistsEmail = await this.restaurantOwnersRepository.validateEmail({
      restaurantOwner: { email: emailValidated }
    })
    if (resultValidateIfExistsEmail.isFailure()) return failure(resultValidateIfExistsEmail.value)
    if (resultValidateIfExistsEmail.value.foundRestaurantOwner) {
      return failure(new EmailAlreadyInUseError({ email: emailValidated }))
    }

    const resultEncryptPassword = await this.cryptoProvider.encryptPassword({
      password: passwordValidated
    })
    if (resultEncryptPassword.isFailure()) return failure(resultEncryptPassword.value)
    const { passwordEncrypted } = resultEncryptPassword.value

    const resultCreateRestaurantOwner = RestaurantOwner.create({
      name: nameValidated,
      email: emailValidated,
      whatsApp: whatsAppValidated,
      password: passwordEncrypted
    })
    if (resultCreateRestaurantOwner.isFailure()) return failure(resultCreateRestaurantOwner.value)
    const { restaurantOwnerCreated } = resultCreateRestaurantOwner.value

    const resultSaveRestaurantOwner = await this.restaurantOwnersRepository.save({
      restaurantOwner: restaurantOwnerCreated
    })
    if (resultSaveRestaurantOwner.isFailure()) return failure(resultSaveRestaurantOwner.value)

    return success({ restaurantOwner: restaurantOwnerCreated })
  }
}
