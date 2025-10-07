import type { ModelName } from '../shared/model-name'
import type { ValueObjectName } from '../shared/value-object-name'

import { type Either, failure, success } from '@peatti/utils'
import { v7 as randomUUID } from 'uuid'

import { GenerateIDError } from '../errors/value-objects/id/generate-id.error'
import { type InvalidIDError } from '../errors/value-objects/id/invalid-id.error'

export class ID {
  public readonly value: string

  private constructor(parameters: { id: string }) {
    this.value = parameters.id.trim()
    Object.freeze(this)
  }

  public toString(): string {
    return this.value
  }

  public static validate(
    parameters: { id: string; modelName: ModelName } | { id: string; valueObjectName: ValueObjectName }
  ): Either<InvalidIDError, { idValidated: ID }> {
    return success({ idValidated: new ID({ id: parameters.id.trim() }) })
  }

  public static generate(
    parameters: { modelName: ModelName } | { valueObjectName: ValueObjectName }
  ): Either<GenerateIDError, { idGenerated: ID }> {
    try {
      console.log('generating id')
      return success({ idGenerated: new ID({ id: randomUUID() }) })
    } catch (error: unknown) {
      return failure(
        new GenerateIDError({
          ...('modelName' in parameters
            ? { modelName: parameters.modelName }
            : { valueObjectName: parameters.valueObjectName }),
          error: error instanceof Error ? error : new Error(String(error))
        })
      )
    }
  }
  public equals(parameters: { otherID: ID }): boolean {
    if (!(parameters.otherID instanceof ID)) return false
    return this.value.toLowerCase().trim() === parameters.otherID.value.toLowerCase().trim()
  }
}
