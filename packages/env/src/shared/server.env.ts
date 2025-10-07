import { Environment } from '@peatti/domain'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const serverENV = createEnv({
  server: {
    ENVIRONMENT: z.enum(Object.values(Environment), { error: 'ENVIRONMENT is required' })
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})

export type ServerConfig = typeof serverENV
