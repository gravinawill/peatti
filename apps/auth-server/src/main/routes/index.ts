import { type OpenAPIHono } from '@hono/zod-openapi'

import { customersRoutes } from './customers'
import { docsRoutes } from './docs/docs.routes'
import { healthRoutes } from './health.routes'

export function routes(app: OpenAPIHono): void {
  healthRoutes(app)
  customersRoutes(app)
  docsRoutes(app)
}
