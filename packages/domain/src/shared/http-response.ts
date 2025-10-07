import { type HTTP_STATUS_CODE } from '@peatti/utils'

import { type ERROR_NAME } from './error-name'
import { type STATUS_ERROR } from './status-error'
import { type STATUS_SUCCESS } from './status-success'

export type HttpResponse<SuccessData> = {
  httpStatusCode: HTTP_STATUS_CODE
  data: HttpResponseError | HttpResponseSuccess<SuccessData>
}

export type ResponseError = {
  name: ERROR_NAME
  status: STATUS_ERROR
  message: string
}

export type ResponseSuccess<SuccessData> = SuccessData & {
  status: STATUS_SUCCESS
  message: string
}

export type HttpResponseSuccess<SuccessData> = {
  error: null
  success: ResponseSuccess<SuccessData>
}

export type HttpResponseError = {
  success: null
  error: ResponseError
}
