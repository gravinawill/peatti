import { type ISaveCustomersRepository } from '@contracts/repositories/customers/save.customers-repository'
import { type IValidateEmailCustomersRepository } from '@contracts/repositories/customers/validate-email.customers-repository'
import { type IValidateWhatsAppCustomersRepository } from '@contracts/repositories/customers/validate-whatsapp.customers-repository'
import { Database } from '@infra/database/database'
import { CustomersPrismaRepository } from '@infra/database/repositories/customers.prisma-repository'
import { makeLoggerProvider } from '@peatti/logger'

export const makeCustomersRepository = (): ISaveCustomersRepository &
  IValidateWhatsAppCustomersRepository &
  IValidateEmailCustomersRepository => new CustomersPrismaRepository(makeLoggerProvider(), Database.getInstance())
