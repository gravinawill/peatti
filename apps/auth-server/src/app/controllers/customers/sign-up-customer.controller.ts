import {
  type HttpRequest,
  type ILoggerProvider,
  type ResponseSuccess,
  STATUS_SUCCESS,
  type UseCase
} from '@peatti/domain'
import { type CustomError } from '@peatti/domain/src/shared/custom.error'
import { Controller } from '@peatti/domain/src/shared/rest-controller'
import { type Either } from '@peatti/utils'
import { failure, success } from '@peatti/utils'
import { type SignUpCustomerUseCaseDTO } from '@use-cases/customers/sign-up-customer.use-case'

export namespace SignUpCustomerControllerDTO {
  export type Body = Readonly<{
    customer: {
      name: string
      email: string
      whatsapp: string
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

export class SignUpCustomerController extends Controller<
  SignUpCustomerControllerDTO.Parameters,
  SignUpCustomerControllerDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ILoggerProvider,
    private readonly signUpCustomerUseCase: UseCase<
      SignUpCustomerUseCaseDTO.Parameters,
      SignUpCustomerUseCaseDTO.ResultFailure,
      SignUpCustomerUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider)
  }

  protected async performOperation(
    parameters: SignUpCustomerControllerDTO.Parameters
  ): SignUpCustomerControllerDTO.Result {
    const response = await this.signUpCustomerUseCase.execute({
      customer: {
        name: parameters.body.customer.name,
        email: parameters.body.customer.email,
        whatsApp: parameters.body.customer.whatsapp,
        password: parameters.body.customer.password
      }
    })
    if (response.isFailure()) return failure(response.value)

    return success({
      access_token: 'test',
      message: 'Customer signed up successfully',
      status: STATUS_SUCCESS.CREATED
    })
  }
}
