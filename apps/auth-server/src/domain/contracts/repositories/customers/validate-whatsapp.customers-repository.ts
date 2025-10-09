import { type Customer, type InvalidIDError, type InvalidWhatsappError, type RepositoryError } from '@peatti/domain'
import { type Either } from '@peatti/utils'

export namespace ValidateWhatsAppCustomersRepositoryDTO {
  export type Parameters = Readonly<{ customer: Pick<Customer, 'whatsApp'> }>

  export type ResultFailure = Readonly<RepositoryError | InvalidIDError | InvalidWhatsappError>
  export type ResultSuccess = Readonly<{
    foundCustomer: null | Pick<Customer, 'id' | 'name' | 'whatsApp'>
  }>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export interface IValidateWhatsAppCustomersRepository {
  validateWhatsApp(
    parameters: ValidateWhatsAppCustomersRepositoryDTO.Parameters
  ): ValidateWhatsAppCustomersRepositoryDTO.Result
}
