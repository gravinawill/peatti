import { Database } from '@infra/database/database'
import { authServerENV } from '@peatti/env'
import { makeLoggerProvider } from '@peatti/logger'

import { createServer } from './main/hono'

const server = createServer()

server.listen(authServerENV.AUTH_SERVER_PORT, () => {
  const logger = makeLoggerProvider()
  Database.getInstance()
    .healthCheck()
    .then((result) => {
      if (result.isFailure()) {
        logger.sendLogError({
          message: 'Database health check failed',
          error: result.value
        })
      }
    })
    .finally(() => {
      logger.sendLogInfo({
        message: `🚀 Auth Server is running on http://${authServerENV.AUTH_SERVER_HOST}:${authServerENV.AUTH_SERVER_PORT}`
      })
      logger.sendLogInfo({
        message: `📚 API Documentation available at http://${authServerENV.AUTH_SERVER_HOST}:${authServerENV.AUTH_SERVER_PORT}/docs`
      })
    })
})
