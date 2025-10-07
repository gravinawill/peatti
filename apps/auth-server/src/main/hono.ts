import { serve, type ServerType } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { authServerENV } from '@peatti/env'
import { compress } from 'hono/compress'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'

import { corsMiddleware } from './middlewares/cors.middleware'
import { errorHandler } from './middlewares/error-handler.middleware'
import { notFoundHandler } from './middlewares/not-found.middleware'
import { routes } from './routes'

const buildApp = (): OpenAPIHono => {
  const app = new OpenAPIHono({ strict: true })
  app.use('*', prettyJSON())
  app.use('*', compress())
  app.use('*', secureHeaders())
  app.use('*', corsMiddleware)
  routes(app)
  app.notFound(notFoundHandler)
  app.onError(errorHandler)
  return app
}

export const createServer = (): ServerType => {
  const app = buildApp()
  return serve({
    fetch: app.fetch,
    port: authServerENV.AUTH_SERVER_PORT,
    hostname: authServerENV.AUTH_SERVER_HOST
  })
}
