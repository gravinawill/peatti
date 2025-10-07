import { type OpenAPIHono } from '@hono/zod-openapi'
import { Database } from '@infra/database/database'

export function healthRoutes(app: OpenAPIHono): void {
  app.get('/', async (c) => {
    try {
      const result = await Database.getInstance().healthCheck()
      if (result.isFailure()) {
        return c.json({ status: 'unhealthy' }, 503)
      }
      return c.json({ status: 'healthy' }, 200)
    } catch {
      return c.json({ status: 'unhealthy' }, 503)
    }
  })
}
