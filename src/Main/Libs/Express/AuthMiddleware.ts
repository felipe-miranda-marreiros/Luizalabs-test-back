import { NextFunction, Response } from 'express'
import { nodeUserContextAdapter } from '@/Infrastructure/Context/NodeUserContextAdapter'
import { RequestWithUser } from '@/Main/Types/RequestWithUser'
import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'

export function expressAuthenticationMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (req.current_user) {
    logger.info(`Request with user (${req.current_user.id}) was initiated`)
    nodeUserContextAdapter.setLoggedInUser(req.current_user, next)
  } else {
    logger.error('An user tried to access a protected route')
    res.status(401).json({})
  }
}
