import { type OpenAPIHono } from '@hono/zod-openapi'

/*
 * import { Database } from '@infra-database/database'
 * import { productsInventoryServerENV } from '@niki/env'
 * import { makeLoggerProvider } from '@niki/logger'
 */

export function healthRoutes(app: OpenAPIHono): void {
  app.get('/', (c) => {
    try {
      return c.json({ status: 'healthy' }, 200)
    } catch {
      return c.json({ status: 'unhealthy' }, 503)
    }
  })
}
