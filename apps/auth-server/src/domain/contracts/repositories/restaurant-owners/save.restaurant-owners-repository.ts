import { type RestaurantOwner } from '@models/restaurant-owner.model'
import { type RepositoryError } from '@peatti/domain'
import { type Either } from '@peatti/utils'

export namespace SaveRestaurantOwnersRepositoryDTO {
  export type Parameters = Readonly<{ restaurantOwner: RestaurantOwner }>

  export type ResultFailure = Readonly<RepositoryError>
  export type ResultSuccess = Readonly<null>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface ISaveRestaurantOwnersRepository {
  save(parameters: SaveRestaurantOwnersRepositoryDTO.Parameters): SaveRestaurantOwnersRepositoryDTO.Result
}
