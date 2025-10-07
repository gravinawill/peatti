import { performance } from 'node:perf_hooks'

import { type Either, HTTP_STATUS_CODE } from '@peatti/utils'

import { type ILoggerProvider } from '../contracts/providers/logger/logger'

import { type CustomError } from './custom.error'
import { ERROR_NAME } from './error-name'
import { type HttpRequest } from './http-request'
import { type HttpResponse, type ResponseError, type ResponseSuccess } from './http-response'
import { STATUS_ERROR } from './status-error'
import { STATUS_SUCCESS } from './status-success'

export interface IRestController {
  handle(httpRequest: HttpRequest): Promise<HttpResponse<unknown>>
}

export function selectStatusCode({ status }: { status: STATUS_ERROR | STATUS_SUCCESS }): HTTP_STATUS_CODE {
  switch (status) {
    // Success statuses
    case STATUS_SUCCESS.CREATED: {
      return HTTP_STATUS_CODE.CREATED
    }
    case STATUS_SUCCESS.DONE: {
      return HTTP_STATUS_CODE.OK
    }
    case STATUS_SUCCESS.DELETED: {
      return HTTP_STATUS_CODE.OK
    }
    case STATUS_SUCCESS.UPDATED: {
      return HTTP_STATUS_CODE.OK
    }
    case STATUS_SUCCESS.LISTED: {
      return HTTP_STATUS_CODE.OK
    }

    case STATUS_SUCCESS.FOUND: {
      return HTTP_STATUS_CODE.OK
    }

    // Error statuses
    case STATUS_ERROR.NOT_FOUND: {
      return HTTP_STATUS_CODE.NOT_FOUND
    }
    case STATUS_ERROR.NOT_EXISTS: {
      return HTTP_STATUS_CODE.NOT_FOUND
    }
    case STATUS_ERROR.INVALID: {
      return HTTP_STATUS_CODE.BAD_REQUEST
    }
    case STATUS_ERROR.REPOSITORY_ERROR: {
      return HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    }
    case STATUS_ERROR.PROVIDER_ERROR: {
      return HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    }
    case STATUS_ERROR.INTERNAL_ERROR: {
      return HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    }
    case STATUS_ERROR.CONFLICT: {
      return HTTP_STATUS_CODE.CONFLICT
    }
    case STATUS_ERROR.UNAUTHORIZED: {
      return HTTP_STATUS_CODE.UNAUTHORIZED
    }
    case STATUS_ERROR.TOO_MANY_REQUESTS: {
      return HTTP_STATUS_CODE.TOO_MANY_REQUESTS
    }

    default: {
      return HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    }
  }
}

export abstract class Controller<Parameters, SuccessData> {
  private readonly controllerName: string

  constructor(private readonly loggerProvider: ILoggerProvider) {
    this.controllerName = this.constructor.name
  }

  public async handle(parameters: Parameters): Promise<HttpResponse<SuccessData>> {
    const startTime = performance.now()
    try {
      this.logRequestStart()
      const response = await this.performOperation(parameters)
      if (response.isFailure()) {
        const errorResponse = this.handleErrorResponse({
          error: response.value,
          startTime
        })
        return errorResponse
      }
      const successResponse = this.handleSuccessResponse({
        startTime,
        success: response.value
      })
      return successResponse
    } catch (error) {
      return this.handleUnexpectedError({
        error,
        parameters,
        startTime
      })
    }
  }

  private logRequestStart(): void {
    this.loggerProvider.sendLogTimeController({
      runtimeInMs: 0,
      controllerName: this.controllerName,
      isSuccess: true
    })
  }

  private handleErrorResponse(parameters: { error: unknown; startTime: number }): HttpResponse<SuccessData> {
    const runtimeInMs = performance.now() - parameters.startTime

    this.loggerProvider.sendLogTimeController({
      runtimeInMs,
      controllerName: this.controllerName,
      isSuccess: false
    })

    this.loggerProvider.sendLogError({
      message: `${this.controllerName} operation failed`,
      error: {
        error:
          typeof parameters.error === 'object' &&
          parameters.error !== null &&
          'message' in parameters.error &&
          typeof (parameters.error as { message?: unknown }).message === 'string'
            ? (parameters.error as { message: string }).message
            : String(parameters.error),
        status:
          typeof parameters.error === 'object' &&
          parameters.error !== null &&
          'status' in parameters.error &&
          Object.values(STATUS_ERROR).includes((parameters.error as { status: STATUS_ERROR }).status)
            ? (parameters.error as { status: STATUS_ERROR }).status
            : STATUS_ERROR.INTERNAL_ERROR
      }
    })

    return this.makeResponseError({
      status: STATUS_ERROR.INTERNAL_ERROR,
      message:
        typeof parameters.error === 'object' &&
        parameters.error !== null &&
        'message' in parameters.error &&
        typeof (parameters.error as { message?: unknown }).message === 'string'
          ? (parameters.error as { message: string }).message
          : String(parameters.error),
      name: ERROR_NAME.GENERATE_ID_ERROR
    })
  }

  private handleSuccessResponse(parameters: {
    success: ResponseSuccess<SuccessData>
    startTime: number
  }): HttpResponse<SuccessData> {
    const runtimeInMs = performance.now() - parameters.startTime
    this.loggerProvider.sendLogTimeController({
      runtimeInMs,
      controllerName: this.controllerName,
      isSuccess: true
    })
    return this.makeResponseSuccess({ responseSuccess: parameters.success })
  }

  private handleUnexpectedError(parameters: {
    error: unknown
    parameters: Parameters
    startTime: number
  }): HttpResponse<SuccessData> {
    const runtimeInMs = performance.now() - parameters.startTime

    this.loggerProvider.sendLogError({
      message: `${this.controllerName} unexpected error`,
      error: {
        message:
          typeof parameters.error === 'object' &&
          parameters.error !== null &&
          'message' in parameters.error &&
          typeof (parameters.error as { message?: unknown }).message === 'string'
            ? (parameters.error as { message: string }).message
            : String(parameters.error),
        error:
          typeof parameters.error === 'object' && parameters.error !== null && 'value' in parameters.error
            ? (parameters.error as { value: unknown }).value
            : parameters.error,
        parameters: this.serializeParameters(parameters.parameters),
        runtimeInMs
      }
    })

    return {
      httpStatusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      data: {
        success: null,
        error: {
          name: ERROR_NAME.INTERNAL_ERROR,
          status: STATUS_ERROR.INTERNAL_ERROR,
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  private makeResponseError(error: ResponseError): HttpResponse<SuccessData> {
    const httpStatusCode = selectStatusCode({ status: error.status })
    return {
      httpStatusCode,
      data: {
        success: null,
        error: {
          name: error.name,
          status: error.status,
          message: error.message
        }
      }
    }
  }

  private makeResponseSuccess(parameters: {
    responseSuccess: ResponseSuccess<SuccessData>
  }): HttpResponse<SuccessData> {
    const httpStatusCode = selectStatusCode({ status: parameters.responseSuccess.status })
    return {
      httpStatusCode,
      data: {
        error: null,
        success: {
          ...parameters.responseSuccess,
          status: parameters.responseSuccess.status,
          message: parameters.responseSuccess.message
        }
      }
    }
  }

  private serializeParameters(parameters: Parameters): string {
    try {
      return JSON.stringify(parameters, null, 2)
    } catch {
      return String(parameters)
    }
  }

  protected abstract performOperation(
    parameters: Parameters
  ): Promise<Either<CustomError, ResponseSuccess<SuccessData>>>
}
