import { CustomError } from '../../shared/custom.error'
import { ERROR_NAME } from '../../shared/error-name'
import { STATUS_ERROR } from '../../shared/status-error'

export type ProviderMethod = CryptoProviderMethods | TokenProviderMethods | DatabaseProviderMethods
export interface ProviderErrorParameters {
  readonly error: unknown
  readonly provider: {
    readonly name: ProvidersNames
    readonly method: ProviderMethod
    readonly externalName: string
  }
}

export enum ProvidersNames {
  CRYPTO = 'crypto',
  TOKEN = 'token',
  DATABASE = 'database'
}

export enum TokenProviderMethods {
  GENERATE_JWT = 'generate jwt',
  VERIFY_JWT = 'verify jwt'
}

export enum CryptoProviderMethods {
  ENCRYPT_PASSWORD = 'encrypt password',
  COMPARE_ENCRYPTED_PASSWORD = 'compare encrypted password'
}

export enum DatabaseProviderMethods {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  HEALTH_CHECK = 'health check',
  QUERY = 'query',
  TRANSACTION = 'transaction'
}

export class ProviderError extends CustomError {
  constructor(parameters: ProviderErrorParameters) {
    const message = ProviderError.formatErrorMessage(parameters.provider)

    super({
      name: ERROR_NAME.PROVIDER_ERROR,
      message,
      status: STATUS_ERROR.PROVIDER_ERROR,
      error: parameters.error
    })
  }

  private static formatErrorMessage(provider: ProviderErrorParameters['provider']): string {
    const baseMessage = `Error in ${provider.name} provider in ${provider.method} method.`

    if (provider.externalName && provider.externalName.trim() !== '') {
      return `${baseMessage} Error in external lib name: ${provider.externalName}.`
    }

    return baseMessage
  }
}
