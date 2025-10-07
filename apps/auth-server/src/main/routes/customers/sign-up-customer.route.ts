import { createRoute, z } from '@hono/zod-openapi'
import { STATUS_ERROR, STATUS_SUCCESS } from '@peatti/domain'

const VALIDATION_CONSTANTS = {
  CUSTOMER_NAME: {
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

const CustomerNameSchema = z
  .string()
  .min(
    VALIDATION_CONSTANTS.CUSTOMER_NAME.MIN_LENGTH,
    `Name must be at least ${VALIDATION_CONSTANTS.CUSTOMER_NAME.MIN_LENGTH} characters`
  )
  .max(
    VALIDATION_CONSTANTS.CUSTOMER_NAME.MAX_LENGTH,
    `Name must be ${VALIDATION_CONSTANTS.CUSTOMER_NAME.MAX_LENGTH} characters or less`
  )
  .openapi({
    example: 'John Doe',
    description: 'The customer name. Must be a non-empty string between 3 and 255 characters.'
  })

const CustomerWhatsAppSchema = z
  .string()
  .min(
    VALIDATION_CONSTANTS.WHATSAPP.MIN_LENGTH,
    `WhatsApp number must be at least ${VALIDATION_CONSTANTS.WHATSAPP.MIN_LENGTH} characters`
  )
  .max(
    VALIDATION_CONSTANTS.WHATSAPP.MAX_LENGTH,
    `WhatsApp number must be ${VALIDATION_CONSTANTS.WHATSAPP.MAX_LENGTH} characters or less`
  )
  .openapi({
    example: '+1234567890',
    description: 'The customer WhatsApp number. Must be a valid international phone number format (e.g., +1234567890).'
  })

const CustomerEmailSchema = z.email().openapi({
  example: 'john.doe@example.com',
  description: 'The customer email address. Must be a valid email address format.'
})

const CustomerPasswordSchema = z
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
    example: 'ExamplePassword123!',
    description:
      'The customer password. Must be 8-32 characters, no spaces, and contain a mix of letters, numbers, and symbols.'
  })

const SignUpCustomerRequestSchema = z
  .object({
    customer: z
      .object({
        name: CustomerNameSchema,
        whatsapp: CustomerWhatsAppSchema,
        email: CustomerEmailSchema,
        password: CustomerPasswordSchema
      })
      .openapi('CustomerSignUpData')
  })
  .openapi('SignUpCustomerRequest')

const AccessTokenSchema = z.string().min(1).openapi({
  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.jwt.token',
  description: 'JWT access token for customer authentication'
})

const SuccessStatusSchema = z.string().openapi({
  example: STATUS_SUCCESS.CREATED,
  description: 'Success status code'
})

const ErrorNameSchema = z.string().openapi({
  example: 'InvalidCustomerNameError',
  description: 'Specific error type name'
})

const ErrorStatusSchema = z.string().openapi({
  example: STATUS_ERROR.INVALID,
  description: 'Error status code'
})

const ErrorMessageSchema = z.string().openapi({
  example: 'Customer name must be at least 3 characters',
  description: 'Detailed error message'
})

const SignUpCustomerSuccessResponseSchema = z
  .object({
    success: z.object({
      access_token: AccessTokenSchema,
      status: SuccessStatusSchema,
      message: z.string().openapi({
        example: 'Customer signed up successfully',
        description: 'Success message confirming customer registration'
      })
    }),
    error: z.null()
  })
  .openapi('SignUpCustomerSuccessResponse')

const SignUpCustomerErrorResponseSchema = z
  .object({
    success: z.null(),
    error: z.object({
      name: ErrorNameSchema,
      status: ErrorStatusSchema,
      message: ErrorMessageSchema,
      details: z
        .object({
          field: z.string().optional().openapi({
            example: 'customer.name',
            description: 'The field that caused the validation error'
          }),
          value: z.string().optional().openapi({
            example: 'Jo',
            description: 'The invalid value that was provided'
          }),
          constraint: z.string().optional().openapi({
            example: 'minimum length',
            description: 'The validation constraint that was violated'
          })
        })
        .optional()
        .openapi({
          description: 'Additional error details for validation errors'
        })
    })
  })
  .openapi('SignUpCustomerErrorResponse')

export type SignUpCustomerRequest = z.infer<typeof SignUpCustomerRequestSchema>
export type SignUpCustomerSuccessResponse = z.infer<typeof SignUpCustomerSuccessResponseSchema>
export type SignUpCustomerErrorResponse = z.infer<typeof SignUpCustomerErrorResponseSchema>

export const signUpCustomerRoute = createRoute({
  method: 'post',
  path: '/customers/sign-up',
  tags: ['Customers'],
  operationId: 'signUpCustomer',
  summary: 'Register a new customer',
  description: `
    Creates a new customer account and returns a JWT access token for authentication.
  `,
  request: {
    body: {
      content: {
        'application/json': {
          schema: SignUpCustomerRequestSchema
        }
      },
      required: true,
      description: 'Customer registration data with validated fields'
    }
  },
  responses: {
    201: {
      description: 'Customer successfully registered',
      content: {
        'application/json': {
          schema: SignUpCustomerSuccessResponseSchema,
          examples: {
            success: {
              summary: 'Successful registration',
              value: {
                success: {
                  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.jwt.token',
                  status: 'CREATED',
                  message: 'Customer signed up successfully'
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
          schema: SignUpCustomerErrorResponseSchema,
          examples: {
            validationError: {
              summary: 'Name too short',
              value: {
                success: null,
                error: {
                  name: 'InvalidCustomerNameError',
                  status: 'INVALID',
                  message: 'Customer name must be at least 3 characters',
                  details: {
                    field: 'customer.name',
                    value: 'Jo',
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
                  message: 'Email john.doe@example.com is already in use',
                  details: {
                    field: 'customer.email',
                    value: 'john.doe@example.com'
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
          schema: SignUpCustomerErrorResponseSchema,
          examples: {
            emailConflict: {
              summary: 'Email already registered',
              value: {
                success: null,
                error: {
                  name: 'EmailAlreadyInUseError',
                  status: 'CONFLICT',
                  message: 'Email john.doe@example.com is already in use'
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
                  message: 'WhatsApp +1234567890 is already in use'
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
          schema: SignUpCustomerErrorResponseSchema,
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
