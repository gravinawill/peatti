import { type HttpRequest, type IRestController } from '@peatti/domain'
import { HTTP_STATUS_CODE } from '@peatti/utils'
import { type Context } from 'hono'

export const createHonoAdapterRoute = (controller: IRestController) => {
  return async (context: Context) => {
    try {
      let body = {}
      const contentType = context.req.header('content-type')
      if (contentType?.includes('application/json')) {
        try {
          body = await context.req.json()
        } catch {
          context.status(HTTP_STATUS_CODE.BAD_REQUEST)
          return context.json({
            success: null,
            error: {
              name: 'ValidationError',
              message: 'Invalid JSON payload'
            }
          })
        }
      } else {
        body = await context.req.parseBody()
      }

      const httpRequest: HttpRequest = {
        body,
        access_token: context.req.header('Authorization') ?? '',
        params: context.req.param(),
        query: context.req.query(),
        headers: context.req.header()
      }

      const { data, httpStatusCode } = await controller.handle(httpRequest)

      context.status(httpStatusCode)
      return context.json(data)
    } catch (error) {
      console.error('Hono adapter error:', error)
      context.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      return context.json({
        success: null,
        error: {
          name: 'InternalServerError',
          message: 'Internal server error'
        }
      })
    }
  }
}
