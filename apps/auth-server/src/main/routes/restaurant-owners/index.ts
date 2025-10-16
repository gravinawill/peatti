import { makeSignUpRestaurantOwnerController } from '@factories/controllers/restaurant-owners/sign-up-restaurant-owner-controller.factory'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { type Handler } from 'hono'
import { createHonoAdapterRoute } from 'src/main/adapters/hono-router.adapter'

import { signUpRestaurantOwnerRoute } from './sign-up-restaurant-owner.route'

export function restaurantOwnersRoutes(app: OpenAPIHono): void {
  app.openapi(signUpRestaurantOwnerRoute, createHonoAdapterRoute(makeSignUpRestaurantOwnerController()) as Handler)
}
