import { Environment } from '@peatti/domain'
import { authServerENV } from '@peatti/env'
import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: authServerENV.ENVIRONMENT === Environment.PRODUCTION ? authServerENV.AUTH_SERVER_CORS_ORIGIN : ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  credentials: true
})
