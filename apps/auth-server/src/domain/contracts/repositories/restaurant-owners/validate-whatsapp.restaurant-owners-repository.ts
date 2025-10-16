import { type RestaurantOwner } from '@models/restaurant-owner.model'
import { type InvalidIDError, type InvalidWhatsappError, type RepositoryError } from '@peatti/domain'
import { type Either } from '@peatti/utils'

export namespace ValidateWhatsAppRestaurantOwnersRepositoryDTO {
  export type Parameters = Readonly<{ restaurantOwner: Pick<RestaurantOwner, 'whatsApp'> }>

  export type ResultFailure = Readonly<RepositoryError | InvalidIDError | InvalidWhatsappError>
  export type ResultSuccess = Readonly<{
    foundRestaurantOwner: null | Pick<RestaurantOwner, 'id' | 'name' | 'whatsApp'>
  }>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface IValidateWhatsAppRestaurantOwnersRepository {
  validateWhatsApp(
    parameters: ValidateWhatsAppRestaurantOwnersRepositoryDTO.Parameters
  ): ValidateWhatsAppRestaurantOwnersRepositoryDTO.Result
}
