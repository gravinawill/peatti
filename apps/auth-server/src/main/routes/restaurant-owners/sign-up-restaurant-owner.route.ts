import { createRoute, z } from '@hono/zod-openapi'
import { STATUS_ERROR, STATUS_SUCCESS } from '@peatti/domain'

const VALIDATION_CONSTANTS = {
  RESTAURANT_OWNER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 32
  },
  WHATSAPP: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 20
  }
} as const

const RestaurantOwnerNameSchema = z
  .string()
  .min(
    VALIDATION_CONSTANTS.RESTAURANT_OWNER_NAME.MIN_LENGTH,
    `Name must be at least ${VALIDATION_CONSTANTS.RESTAURANT_OWNER_NAME.MIN_LENGTH} characters`
  )
  .max(
    VALIDATION_CONSTANTS.RESTAURANT_OWNER_NAME.MAX_LENGTH,
    `Name must be ${VALIDATION_CONSTANTS.RESTAURANT_OWNER_NAME.MAX_LENGTH} characters or less`
  )
  .openapi({
    example: 'Jane Doe',
    description: `The restaurant owner's name. Between ${VALIDATION_CONSTANTS.RESTAURANT_OWNER_NAME.MIN_LENGTH}-${VALIDATION_CONSTANTS.RESTAURANT_OWNER_NAME.MAX_LENGTH} characters.`
  })

const RestaurantOwnerWhatsAppSchema = z
  .string()
  .min(
    VALIDATION_CONSTANTS.WHATSAPP.MIN_LENGTH,
    `WhatsApp must be at least ${VALIDATION_CONSTANTS.WHATSAPP.MIN_LENGTH} characters`
  )
  .max(
    VALIDATION_CONSTANTS.WHATSAPP.MAX_LENGTH,
    `WhatsApp must be ${VALIDATION_CONSTANTS.WHATSAPP.MAX_LENGTH} characters or less`
  )
  .openapi({
    example: '+5521999998888',
    description: "Restaurant owner's WhatsApp number in international format."
  })

const RestaurantOwnerEmailSchema = z.email().openapi({
  example: 'restaurant.owner@example.com',
  description: `Restaurant owner's email address.`
})

const RestaurantOwnerPasswordSchema = z
  .string()
  .min(
    VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH,
    `Password must be at least ${VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH} characters`
  )
  .max(
    VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH,
    `Password must be ${VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH} characters or less`
  )
  .regex(/^\S+$/, 'Password must not contain spaces')
  .openapi({
    example: 'StrongPassword!2024',
    description: 'Password, 8-32 chars, no spaces, should contain letters/numbers/symbols.'
  })

const SignUpRestaurantOwnerRequestSchema = z
  .object({
    restaurant_owner: z
      .object({
        name: RestaurantOwnerNameSchema,
        whatsapp: RestaurantOwnerWhatsAppSchema,
        email: RestaurantOwnerEmailSchema,
        password: RestaurantOwnerPasswordSchema
      })
      .openapi('RestaurantOwnerSignUpData')
  })
  .openapi('SignUpRestaurantOwnerRequest')

const AccessTokenSchema = z.string().min(1).openapi({
  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.restaurantowner.jwt.token',
  description: 'JWT access token for restaurant owner authentication'
})

const SuccessStatusSchema = z.string().openapi({
  example: STATUS_SUCCESS.CREATED,
  description: 'Success status code'
})

const ErrorNameSchema = z.string().openapi({
  example: 'InvalidRestaurantOwnerNameError',
  description: 'The type of error'
})

const ErrorStatusSchema = z.string().openapi({
  example: STATUS_ERROR.INVALID,
  description: 'The error status code'
})

const ErrorMessageSchema = z.string().openapi({
  example: 'Owner name must be at least 2 characters',
  description: 'Error description'
})

const SignUpRestaurantOwnerSuccessResponseSchema = z
  .object({
    success: z.object({
      access_token: AccessTokenSchema,
      status: SuccessStatusSchema,
      message: z.string().openapi({
        example: 'Restaurant owner signed up successfully',
        description: 'Success message'
      })
    }),
    error: z.null()
  })
  .openapi('SignUpRestaurantOwnerSuccessResponse')

const SignUpRestaurantOwnerErrorResponseSchema = z
  .object({
    success: z.null(),
    error: z.object({
      name: ErrorNameSchema,
      status: ErrorStatusSchema,
      message: ErrorMessageSchema,
      details: z
        .object({
          field: z.string().optional().openapi({
            example: 'restaurant_owner.name',
            description: 'Field with validation error'
          }),
          value: z.string().optional().openapi({
            example: 'J',
            description: 'Value provided'
          }),
          constraint: z.string().optional().openapi({
            example: 'minimum length',
            description: 'Violated constraint'
          })
        })
        .optional()
        .openapi({
          description: 'Extra error details'
        })
    })
  })
  .openapi('SignUpRestaurantOwnerErrorResponse')

export type SignUpRestaurantOwnerRequest = z.infer<typeof SignUpRestaurantOwnerRequestSchema>
export type SignUpRestaurantOwnerSuccessResponse = z.infer<typeof SignUpRestaurantOwnerSuccessResponseSchema>
export type SignUpRestaurantOwnerErrorResponse = z.infer<typeof SignUpRestaurantOwnerErrorResponseSchema>

export const signUpRestaurantOwnerRoute = createRoute({
  method: 'post',
  path: '/restaurant-owners/sign-up',
  tags: ['Restaurant Owners'],
  operationId: 'signUpRestaurantOwner',
  summary: 'Register a new restaurant owner',
  description: `
    Creates a new restaurant owner account and returns a JWT access token for authentication.
  `,
  request: {
    body: {
      content: {
        'application/json': {
          schema: SignUpRestaurantOwnerRequestSchema
        }
      },
      required: true,
      description: 'Restaurant owner registration data with validated fields'
    }
  },
  responses: {
    201: {
      description: 'Restaurant owner successfully registered',
      content: {
        'application/json': {
          schema: SignUpRestaurantOwnerSuccessResponseSchema,
          examples: {
            success: {
              summary: 'Successful registration',
              value: {
                success: {
                  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.restaurantowner.jwt.token',
                  status: 'CREATED',
                  message: 'Restaurant owner signed up successfully'
                },
                error: null
              }
            }
          }
        }
      }
    },
    400: {
      description: 'Validation errors in request data',
      content: {
        'application/json': {
          schema: SignUpRestaurantOwnerErrorResponseSchema,
          examples: {
            validationError: {
              summary: 'Owner name too short',
              value: {
                success: null,
                error: {
                  name: 'InvalidRestaurantOwnerNameError',
                  status: 'INVALID',
                  message: 'Owner name must be at least 2 characters',
                  details: {
                    field: 'restaurant_owner.name',
                    value: 'J',
                    constraint: 'minimum length'
                  }
                }
              }
            },
            emailInUse: {
              summary: 'Email already registered',
              value: {
                success: null,
                error: {
                  name: 'EmailAlreadyInUseError',
                  status: 'CONFLICT',
                  message: 'Email owner@example.com is already in use',
                  details: {
                    field: 'restaurant_owner.email',
                    value: 'owner@example.com'
                  }
                }
              }
            }
          }
        }
      }
    },
    409: {
      description: 'Conflict - Email or WhatsApp already in use',
      content: {
        'application/json': {
          schema: SignUpRestaurantOwnerErrorResponseSchema,
          examples: {
            emailConflict: {
              summary: 'Email already registered',
              value: {
                success: null,
                error: {
                  name: 'EmailAlreadyInUseError',
                  status: 'CONFLICT',
                  message: 'Email owner@example.com is already in use'
                }
              }
            },
            whatsappConflict: {
              summary: 'WhatsApp already registered',
              value: {
                success: null,
                error: {
                  name: 'WhatsappAlreadyInUseError',
                  status: 'CONFLICT',
                  message: 'WhatsApp +5521999998888 is already in use'
                }
              }
            }
          }
        }
      }
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: SignUpRestaurantOwnerErrorResponseSchema,
          examples: {
            serverError: {
              summary: 'Internal server error',
              value: {
                success: null,
                error: {
                  name: 'InternalError',
                  status: 'INTERNAL_ERROR',
                  message: 'An unexpected error occurred while processing your request'
                }
              }
            }
          }
        }
      }
    }
  }
})
