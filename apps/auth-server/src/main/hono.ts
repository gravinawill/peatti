import { serve, type ServerType } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { authServerENV } from '@peatti/env'
import { compress } from 'hono/compress'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'

import { routes } from './routes'

const buildApp = (): OpenAPIHono => {
  const app = new OpenAPIHono({ strict: true })
  app.use('*', prettyJSON())
  app.use('*', compress())
  app.use('*', secureHeaders())
  routes(app)
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
