import { ResponseError } from '../Responses/ResponseError'

export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)
  }

  abstract serializeErrors(): ResponseError[]
}
