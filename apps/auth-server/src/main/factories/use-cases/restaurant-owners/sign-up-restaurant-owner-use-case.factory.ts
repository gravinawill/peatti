import { makeRestaurantOwnersRepository } from '@factories/repositories/restaurant-owners-repository.factory'
import { makeCryptoProvider } from '@peatti/crypto'
import { type UseCase } from '@peatti/domain'
import { makeLoggerProvider } from '@peatti/logger'
import {
  SignUpRestaurantOwnerUseCase,
  type SignUpRestaurantOwnerUseCaseDTO
} from '@use-cases/restaurant-owners/sign-up-restaurant-owner.use-case'

export const makeSignUpRestaurantOwnerUseCase = (): UseCase<
  SignUpRestaurantOwnerUseCaseDTO.Parameters,
  SignUpRestaurantOwnerUseCaseDTO.ResultFailure,
  SignUpRestaurantOwnerUseCaseDTO.ResultSuccess
> => new SignUpRestaurantOwnerUseCase(makeLoggerProvider(), makeRestaurantOwnersRepository(), makeCryptoProvider())
