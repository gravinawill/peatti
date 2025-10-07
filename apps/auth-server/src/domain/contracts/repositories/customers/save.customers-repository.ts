import { type Customer } from '@models/customer.model'
import { type RepositoryError } from '@peatti/domain'
import { type Either } from '@peatti/utils'

export namespace SaveCustomersRepositoryDTO {
  export type Parameters = Readonly<{ customer: Customer }>

  export type ResultFailure = Readonly<RepositoryError>
  export type ResultSuccess = Readonly<null>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface ISaveCustomersRepository {
  save(parameters: SaveCustomersRepositoryDTO.Parameters): SaveCustomersRepositoryDTO.Result
}
