import { CustomError } from '../../../shared/custom.error'
import { ERROR_NAME } from '../../../shared/error-name'
import { type ModelName } from '../../../shared/model-name'
import { STATUS_ERROR } from '../../../shared/status-error'
import { type ValueObjectName } from '../../../shared/value-object-name'

export class GenerateIDError extends CustomError {
  constructor(
    parameters: { modelName: ModelName; error: unknown } | { valueObjectName: ValueObjectName; error: unknown }
  ) {
    super({
      name: ERROR_NAME.GENERATE_ID_ERROR,
      message: `Failed to generate ID for ${'modelName' in parameters ? parameters.modelName : parameters.valueObjectName}`,
      status: STATUS_ERROR.INVALID,
      error: parameters.error
    })
  }
}
