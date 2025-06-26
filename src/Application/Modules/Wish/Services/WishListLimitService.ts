import { BadRequestError } from '@/Application/Contracts/Errors/BadRequestError'

function checkForListLimit(list: number[]) {
  const LIMIT = 5
  if (list.length > LIMIT) {
    throw new BadRequestError(`Limite para listagem de favoritos alcançada`)
  }
  return list
}

export const wishListService = {
  checkForListLimit
}
