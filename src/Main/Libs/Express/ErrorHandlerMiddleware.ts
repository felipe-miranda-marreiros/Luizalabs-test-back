import { CustomError } from '@/Application/Contracts/Errors/CustomError'
import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'
import { NextFunction, Request, Response } from 'express'

export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    logger.warn('An custom error occurred', err)
    res.status(err.statusCode).json({
      errors: err.serializeErrors()
    })
    return
  }
  logger.error('An error occurred', err)
  res.status(500).json(err)
  next()
}
