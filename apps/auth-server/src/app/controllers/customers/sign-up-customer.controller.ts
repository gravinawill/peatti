import {
  Controller,
  type CustomError,
  type HttpRequest,
  type ILoggerProvider,
  type ISendMessageEventProvider,
  type ResponseSuccess,
  STATUS_SUCCESS,
  type UseCase
} from '@peatti/domain'
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
    >,
    private readonly eventProvider: ISendMessageEventProvider
  ) {
    super(loggerProvider)
  }

  protected async performOperation(
    parameters: SignUpCustomerControllerDTO.Parameters
  ): SignUpCustomerControllerDTO.Result {
    const responseSignUp = await this.signUpCustomerUseCase.execute({
      customer: {
        name: parameters.body.customer.name,
        email: parameters.body.customer.email,
        whatsApp: parameters.body.customer.whatsapp,
        password: parameters.body.customer.password
      }
    })
    if (responseSignUp.isFailure()) return failure(responseSignUp.value)
    // const { customer } = responseSignUp.value

    /*
     * const resultSendMessage = await this.eventProvider.sendMessage<CustomersCustomerCreatedPayload>({
     *   eventContractType: CUSTOMER_CREATED_EVENT_CONTRACT_TYPE,
     *   payload: {
     *     customerID: customer.id,
     *     name: customer.name,
     *     email: customer.email,
     *     whatsApp: customer.whatsApp,
     *     customerPendings: customer.customerPendings,
     *     createdAt: customer.createdAt,
     *     updatedAt: customer.updatedAt
     *   }
     * })
     * if (resultSendMessage.isFailure()) return failure(resultSendMessage.value)
     */

    //TODO: Sign in customer

    return success({
      access_token: 'test',
      message: 'Customer signed up successfully',
      status: STATUS_SUCCESS.CREATED
    })
  }
}
