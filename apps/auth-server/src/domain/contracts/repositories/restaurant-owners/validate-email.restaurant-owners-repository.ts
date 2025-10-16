import { type RestaurantOwner } from '@models/restaurant-owner.model'
import { type InvalidEmailError, type InvalidIDError, type RepositoryError } from '@peatti/domain'
import { type Either } from '@peatti/utils'

export namespace ValidateEmailRestaurantOwnersRepositoryDTO {
  export type Parameters = Readonly<{
    restaurantOwner: Pick<RestaurantOwner, 'email'>
  }>

  export type ResultFailure = Readonly<RepositoryError | InvalidIDError | InvalidEmailError>
  export type ResultSuccess = Readonly<{
    foundRestaurantOwner: null | Pick<RestaurantOwner, 'id' | 'name' | 'email'>
  }>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface IValidateEmailRestaurantOwnersRepository {
  validateEmail(
    parameters: ValidateEmailRestaurantOwnersRepositoryDTO.Parameters
  ): ValidateEmailRestaurantOwnersRepositoryDTO.Result
}
