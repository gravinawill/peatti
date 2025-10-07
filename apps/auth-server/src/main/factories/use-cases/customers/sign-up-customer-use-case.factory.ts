import { makeCustomersRepository } from '@factories/repositories/customers-repository.factory'
import { makeCryptoProvider } from '@peatti/crypto'
import { type UseCase } from '@peatti/domain'
import { makeLoggerProvider } from '@peatti/logger'
import { SignUpCustomerUseCase, type SignUpCustomerUseCaseDTO } from '@use-cases/customers/sign-up-customer.use-case'

export const makeSignUpCustomerUseCase = (): UseCase<
  SignUpCustomerUseCaseDTO.Parameters,
  SignUpCustomerUseCaseDTO.ResultFailure,
  SignUpCustomerUseCaseDTO.ResultSuccess
> => new SignUpCustomerUseCase(makeLoggerProvider(), makeCustomersRepository(), makeCryptoProvider())
