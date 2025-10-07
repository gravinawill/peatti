import { type OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'

import { servers } from './servers'
import { tags } from './tags'
import { version } from './version'

export function docsRoutes(app: OpenAPIHono): void {
  app.get(
    '/docs',
    Scalar({
      theme: 'deepSpace',
      darkMode: true,
      _integration: 'hono',
      // isLoading: true,
      showToolbar: 'always',
      showSidebar: true,
      hideModels: true,
      content: app.getOpenAPI31Document({
        openapi: '3.2.0',
        tags,
        security: [{ bearerAuth: ['Authorization'] }],
        info: {
          title: 'Auth Server',
          version,
          description: 'API for managing authentication and customer access with JWT tokens'
        },
        servers
      }),
      defaultHttpClient: {
        targetKey: 'http',
        clientKey: 'http'
      },
      defaultOpenAllTags: false,
      expandAllResponses: true,
      showOperationId: true,
      title: 'Auth Server',
      layout: 'modern',
      slug: 'auth-server',
      telemetry: true,
      pageTitle: 'Auth Server',
      tagsSorter: 'alpha'
    })
  )
}
