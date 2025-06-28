import { BadRequestError } from '@/Application/Contracts/Errors/BadRequestError'
import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'

function checkForListLimit(list: number[]) {
  const LIMIT = 5
  if (list.length > LIMIT) {
    logger.info(`Limit reached with list`, list)
    throw new BadRequestError(`Limite para listagem de favoritos alcançada`)
  }
  return list
}

export const wishListService = {
  checkForListLimit
}
