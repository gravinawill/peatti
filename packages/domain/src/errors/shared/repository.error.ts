import { CustomError } from '../../shared/custom.error'
import { ERROR_NAME } from '../../shared/error-name'
import { STATUS_ERROR } from '../../shared/status-error'

export class RepositoryError extends CustomError {
  constructor(parameters: {
    error: unknown
    repository: {
      name: string
      method: string
      externalName: string
    }
  }) {
    super({
      name: ERROR_NAME.REPOSITORY_ERROR,
      message: `Error in ${parameters.repository.name} repository in ${parameters.repository.method} method.${
        parameters.repository.externalName === ''
          ? ''
          : ` Error in external lib name: ${parameters.repository.externalName}.`
      }`,
      status: STATUS_ERROR.REPOSITORY_ERROR,
      error: parameters.error
    })
  }
}
