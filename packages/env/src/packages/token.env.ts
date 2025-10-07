import { JWTAlgorithm } from '@peatti/domain'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const tokenENV = createEnv({
  server: {
    TOKEN_JWT_SECRET: z
      .string({ error: 'TOKEN_PROVIDER_JWT_SECRET is required' })
      .min(32, { error: 'JWT secret must be at least 32 characters for security' }),

    TOKEN_JWT_EXPIRES_IN_MINUTES: z
      .string({ error: 'TOKEN_PROVIDER_JWT_EXPIRES_IN_MINUTES is required' })
      .transform(Number)
      .pipe(
        z
          .number({ error: 'TOKEN_JWT_EXPIRES_IN_MINUTES must be a number' })
          .int({ error: 'Expiration must be an integer' })
          .positive({ error: 'Expiration must be positive' })
          .max(43_200, { error: 'Expiration cannot exceed 30 days' })
      ),

    TOKEN_JWT_ALGORITHM: z
      .enum(JWTAlgorithm, { error: 'TOKEN_JWT_ALGORITHM must be a valid JWT algorithm' })
      .default(JWTAlgorithm.HS256),

    TOKEN_JWT_ISSUER: z
      .string({
        error: 'TOKEN_JWT_ISSUER is required'
      })
      .min(1, { error: 'Issuer cannot be empty' }),

    TOKEN_JWT_AUDIENCE: z.string().optional()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})

export type TokenConfig = typeof tokenENV
