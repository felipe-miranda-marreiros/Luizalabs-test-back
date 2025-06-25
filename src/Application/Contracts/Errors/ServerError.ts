import { CustomError } from './CustomError'

export class ServerError extends CustomError {
  statusCode = 500

  constructor(message?: string) {
    super(message ?? 'Internal server error')
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
