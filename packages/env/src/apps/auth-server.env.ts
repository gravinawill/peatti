import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

import { tokenENV } from '../packages/token.env'
import { serverENV } from '../shared/server.env'

export const authServerENV = createEnv({
  extends: [serverENV, tokenENV],
  server: {
    AUTH_SERVER_DATABASE_URL: z.string({ error: 'AUTH_SERVER_DATABASE_URL is required' }),
    AUTH_SERVER_HOST: z.string({ error: 'AUTH_SERVER_HOST is required' }),
    AUTH_SERVER_PORT: z
      .string({ error: 'AUTH_SERVER_PORT is required' })
      .transform(Number)
      .pipe(
        z
          .number({ error: 'AUTH_SERVER_PORT must be a number' })
          .int({ error: 'AUTH_SERVER_PORT must be an integer' })
          .positive({ error: 'AUTH_SERVER_PORT must be positive' })
          .min(1, { error: 'AUTH_SERVER_PORT must be greater than 0' })
          .max(65_535, { error: 'AUTH_SERVER_PORT cannot exceed 65,535' })
      ),
    AUTH_SERVER_CORS_ORIGIN: z.string({ error: 'AUTH_SERVER_CORS_ORIGIN is required' }).transform((val) =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})

export type AuthServerConfig = typeof authServerENV
