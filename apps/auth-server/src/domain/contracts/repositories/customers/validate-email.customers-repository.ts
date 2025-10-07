import { type Customer } from '@models/customer.model'
import { type InvalidEmailError, type InvalidIDError, type RepositoryError } from '@peatti/domain'
import { type Either } from '@peatti/utils'

export namespace ValidateEmailCustomersRepositoryDTO {
  export type Parameters = Readonly<{ customer: Pick<Customer, 'email'> }>

  export type ResultFailure = Readonly<RepositoryError | InvalidIDError | InvalidEmailError>
  export type ResultSuccess = Readonly<{
    foundCustomer: null | Pick<Customer, 'id' | 'name' | 'email'>
  }>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface IValidateEmailCustomersRepository {
  validateEmail(parameters: ValidateEmailCustomersRepositoryDTO.Parameters): ValidateEmailCustomersRepositoryDTO.Result
}
