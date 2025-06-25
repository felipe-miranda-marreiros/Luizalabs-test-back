import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'
import { NextFunction, Request, Response } from 'express'

export function expressRequestContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.build()
  next()
}
