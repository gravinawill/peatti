import { SignUpCustomerController } from '@controllers/customers/sign-up-customer.controller'
import { makeSignUpCustomerUseCase } from '@factories/use-cases/customers/sign-up-customer-use-case.factory'
import { type IRestController } from '@peatti/domain'
import { makeLoggerProvider } from '@peatti/logger'

export const makeSignUpCustomerController = (): IRestController =>
  new SignUpCustomerController(makeLoggerProvider(), makeSignUpCustomerUseCase())
