import { BadRequestError } from '@/Application/Contracts/Errors/BadRequestError'
import { Validation } from '@/Presentation/Contracts/Validation'
import { ZodSchema } from 'zod'

export class ZodAdapter implements Validation {
  constructor(private readonly schema: ZodSchema) {}

  validate<TData>(data: TData): TData {
    const result = this.schema.safeParse(data)
    if (result.success) return result.data
    throw new BadRequestError(result.error.issues)
  }
}
