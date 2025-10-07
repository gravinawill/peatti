import { authServerENV } from '@peatti/env'

export const servers = [
  {
    url: `http://${authServerENV.AUTH_SERVER_HOST}:${authServerENV.AUTH_SERVER_PORT}`,
    description: 'Local Development Server'
  }
]
