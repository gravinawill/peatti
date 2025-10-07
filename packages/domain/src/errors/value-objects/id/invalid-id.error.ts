import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { type ModelName } from '../../../shared/model-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type ValueObjectName } from '../../../shared/value-object-name'

export class InvalidIDError extends CustomError {
  constructor(parameters: { id: string; modelName: ModelName } | { id: string; valueObjectName: ValueObjectName }) {
    super({
      name: ERROR_NAME.INVALID_ID_ERROR,
      message: `Invalid ID to ${'valueObjectName' in parameters ? 'value object' : 'model'} ${
        'valueObjectName' in parameters ? parameters.valueObjectName : parameters.modelName
      }`,
      status: STATUS_ERROR.INVALID,
      error: undefined
    })
  }
}
