import { ZodIssue } from 'zod'
import { CustomError } from './CustomError'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor(private readonly errors: ZodIssue[] | string) {
    if (typeof errors === 'string') {
      super(errors)
      return
    }
    super('BadRequestError')
  }

  serializeErrors() {
    if (typeof this.errors === 'string') {
      return [{ message: this.message }]
    }

    return this.errors.map((error) => ({
      message: error.message,
      field: error.path[0] as string
    }))
  }
}
