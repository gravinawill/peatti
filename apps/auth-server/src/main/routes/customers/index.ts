import { makeSignUpCustomerController } from '@factories/controllers/customers/sign-up-customer-controller.factory'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { type Handler } from 'hono'
import { createHonoAdapterRoute } from 'src/main/adapters/hono-router.adapter'

import { signUpCustomerRoute } from './sign-up-customer.route'

export function customersRoutes(app: OpenAPIHono): void {
  // app.openapi(signUpCustomerRoute, createHonoAdapterRoute(makeSignUpCustomerController()) as Handler)
  app.openapi(signUpCustomerRoute, createHonoAdapterRoute(makeSignUpCustomerController()) as Handler)
}
