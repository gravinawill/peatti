import { type ISaveRestaurantOwnersRepository } from '@contracts/repositories/restaurant-owners/save.restaurant-owners-repository'
import { type IValidateEmailRestaurantOwnersRepository } from '@contracts/repositories/restaurant-owners/validate-email.restaurant-owners-repository'
import { type IValidateWhatsAppRestaurantOwnersRepository } from '@contracts/repositories/restaurant-owners/validate-whatsapp.restaurant-owners-repository'
import { Database } from '@infra/database/database'
import { RestaurantOwnersPrismaRepository } from '@infra/database/repositories/restaurant-owners.prisma-repository'
import { makeLoggerProvider } from '@peatti/logger'

export const makeRestaurantOwnersRepository = (): ISaveRestaurantOwnersRepository &
  IValidateWhatsAppRestaurantOwnersRepository &
  IValidateEmailRestaurantOwnersRepository =>
  new RestaurantOwnersPrismaRepository(makeLoggerProvider(), Database.getInstance())
