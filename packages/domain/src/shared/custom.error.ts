import { type ERROR_NAME } from './error-name'
import { type STATUS_ERROR } from './status-error'

export abstract class CustomError {
  public readonly name: ERROR_NAME
  public readonly message: string
  public readonly status: STATUS_ERROR
  public readonly value: unknown

  protected constructor(parameters: { name: ERROR_NAME; message: string; status: STATUS_ERROR; error: unknown }) {
    this.name = parameters.name
    this.message = parameters.message
    this.status = parameters.status
    this.value = parameters.error
  }
}
