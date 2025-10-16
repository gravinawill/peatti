import {
  Controller,
  type CustomError,
  type HttpRequest,
  type ILoggerProvider,
  type ResponseSuccess,
  STATUS_SUCCESS,
  type UseCase
} from '@peatti/domain'
import { type Either, failure, success } from '@peatti/utils'
import { type SignUpRestaurantOwnerUseCaseDTO } from '@use-cases/restaurant-owners/sign-up-restaurant-owner.use-case'

export namespace SignUpRestaurantOwnerControllerDTO {
  export type Body = Readonly<{
    restaurantOwner: {
      name: string
      email: string
      whatsApp: string
      password: string
    }
  }>
  export type Parameters = Readonly<HttpRequest<Body>>
  export type ResultFailure = Readonly<CustomError>
  export type ResultSuccess = Readonly<{
    access_token: string
  }>
  export type Result = Promise<Either<ResultFailure, ResponseSuccess<ResultSuccess>>>
}

export class SignUpRestaurantOwnerController extends Controller<
  SignUpRestaurantOwnerControllerDTO.Parameters,
  SignUpRestaurantOwnerControllerDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ILoggerProvider,
    private readonly signUpRestaurantOwnerUseCase: UseCase<
      SignUpRestaurantOwnerUseCaseDTO.Parameters,
      SignUpRestaurantOwnerUseCaseDTO.ResultFailure,
      SignUpRestaurantOwnerUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider)
  }

  protected async performOperation(
    parameters: SignUpRestaurantOwnerControllerDTO.Parameters
  ): SignUpRestaurantOwnerControllerDTO.Result {
    const response = await this.signUpRestaurantOwnerUseCase.execute({
      restaurantOwner: {
        name: parameters.body.restaurantOwner.name,
        email: parameters.body.restaurantOwner.email,
        whatsApp: parameters.body.restaurantOwner.whatsApp,
        password: parameters.body.restaurantOwner.password
      }
    })
    if (response.isFailure()) return failure(response.value)

    // TODO: Replace with actual JWT creation or token response once integrated
    return success({
      access_token: 'test',
      message: 'Restaurant owner signed up successfully',
      status: STATUS_SUCCESS.CREATED
    })
  }
}
