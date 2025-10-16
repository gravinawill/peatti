import { type Either, failure, success } from '@peatti/utils'

import { InvalidEmailError } from '../errors/value-objects/email/invalid-email.error'

import { type ID } from './id.value-object'

export class Email {
  public readonly value: string
  public readonly isVerified: boolean

  private static readonly MAX_EMAIL_LENGTH = 320
  private static readonly MAX_LOCAL_PART_LENGTH = 64
  private static readonly MAX_DOMAIN_LENGTH = 255
  private static readonly MAX_DOMAIN_PART_LENGTH = 63

  constructor(parameters: { email: string; isVerified: boolean }) {
    this.value = Email.normalizeEmail({ email: parameters.email })
    this.isVerified = parameters.isVerified
    Object.freeze(this)
  }

  public static create(parameters: { email: string }): Either<InvalidEmailError, { emailCreated: Email }> {
    const isVerified = false
    const result = Email.validate({
      customerID: null,
      email: parameters.email
    })
    if (result.isFailure()) return failure(result.value)
    return success({ emailCreated: new Email({ email: parameters.email, isVerified }) })
  }

  public static validate(
    parameters: { email: string; customerID: ID | null } | { email: string; restaurantOwnerID: ID | null }
  ): Either<InvalidEmailError, { emailValidated: Email }> {
    const normalizedEmail = Email.normalizeEmail({ email: parameters.email })

    const errorParams =
      'customerID' in parameters
        ? { email: parameters.email, customerID: parameters.customerID }
        : { email: parameters.email, restaurantOwnerID: parameters.restaurantOwnerID }

    if (!Email.hasValidStructure({ email: normalizedEmail })) {
      return failure(new InvalidEmailError(errorParams))
    }

    const [localPart, domain] = normalizedEmail.split('@')
    if (!localPart || !Email.isValidLocalPart({ localPart })) {
      return failure(new InvalidEmailError(errorParams))
    }

    if (!domain || !Email.isValidDomain({ domain })) {
      return failure(new InvalidEmailError(errorParams))
    }

    return success({ emailValidated: new Email({ email: normalizedEmail, isVerified: false }) })
  }

  public getDomain(): Either<InvalidEmailError, { domain: string }> {
    const [, domain] = this.value.split('@')
    if (!domain) return failure(new InvalidEmailError({ email: this.value, customerID: null }))
    return success({ domain })
  }

  public getLocalPart(): Either<InvalidEmailError, { localPart: string }> {
    const [localPart] = this.value.split('@')
    if (!localPart) return failure(new InvalidEmailError({ email: this.value, customerID: null }))
    return success({ localPart })
  }

  public equals(parameters: { other: Email | string }): boolean {
    const otherValue =
      typeof parameters.other === 'string' ? Email.normalizeEmail({ email: parameters.other }) : parameters.other.value
    return this.value === otherValue
  }

  public toString(): string {
    return this.value
  }

  private static normalizeEmail(parameters: { email: string }): string {
    return parameters.email.toLowerCase().trim()
  }

  private static hasValidStructure(parameters: { email: string }): boolean {
    if (!parameters.email || parameters.email.length === 0 || parameters.email.length > Email.MAX_EMAIL_LENGTH) {
      return false
    }
    const atCount = (parameters.email.match(/@/g) ?? []).length
    if (atCount !== 1) return false
    if (parameters.email.startsWith('@') || parameters.email.endsWith('@')) return false
    if (parameters.email.includes('..')) return false
    const [localPart] = parameters.email.split('@')
    if (!localPart || localPart.startsWith('.') || localPart.endsWith('.')) return false
    return true
  }

  private static isValidLocalPart(parameters: { localPart: string }): boolean {
    if (
      !parameters.localPart ||
      parameters.localPart.length === 0 ||
      parameters.localPart.length > Email.MAX_LOCAL_PART_LENGTH
    ) {
      return false
    }
    const localPartRegex = /^[\w.!#$%&'*+/=?^`{|}~-]+$/
    if (!localPartRegex.test(parameters.localPart)) return false
    if (parameters.localPart.startsWith('.') || parameters.localPart.endsWith('.')) return false
    if (parameters.localPart.includes('..')) return false
    return true
  }

  private static isValidDomain(parameters: { domain: string }): boolean {
    if (!parameters.domain || parameters.domain.length === 0 || parameters.domain.length > Email.MAX_DOMAIN_LENGTH) {
      return false
    }
    if (!parameters.domain.includes('.')) return false
    if (
      parameters.domain.startsWith('.') ||
      parameters.domain.endsWith('.') ||
      parameters.domain.startsWith('-') ||
      parameters.domain.endsWith('-')
    )
      return false
    const domainParts = parameters.domain.split('.')
    for (const part of domainParts) if (!Email.isValidDomainPart({ part })) return false
    const topLevelDomain = domainParts.at(-1)
    if (!topLevelDomain || topLevelDomain.length < 2 || !/^[a-z]+$/i.test(topLevelDomain)) return false
    return true
  }

  private static isValidDomainPart(parameters: { part: string }): boolean {
    if (!parameters.part || parameters.part.length === 0 || parameters.part.length > Email.MAX_DOMAIN_PART_LENGTH) {
      return false
    }
    if (parameters.part.startsWith('-') || parameters.part.endsWith('-')) return false
    const domainPartRegex = /^[a-z0-9-]+$/i
    return domainPartRegex.test(parameters.part)
  }
}
