import { SignUpRestaurantOwnerController } from '@controllers/restaurant-owners/sign-up-restaurant-owner.controller'
import { makeSignUpRestaurantOwnerUseCase } from '@factories/use-cases/restaurant-owners/sign-up-restaurant-owner-use-case.factory'
import { type IRestController } from '@peatti/domain'
import { makeLoggerProvider } from '@peatti/logger'

export const makeSignUpRestaurantOwnerController = (): IRestController =>
  new SignUpRestaurantOwnerController(makeLoggerProvider(), makeSignUpRestaurantOwnerUseCase())
