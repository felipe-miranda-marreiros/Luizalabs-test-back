import { AddOrRemoveWishUseCase } from '@/Application/Modules/Wish/UseCases/AddOrRemoveWish'
import { nodeUserContextAdapter } from '@/Infrastructure/Context/NodeUserContextAdapter'
import { WishSQLRepository } from '@/Infrastructure/Database/Repositories/WishSQLRepository'
import { AddOrRemoveWishController } from '@/Presentation/Controllers/AddOrRemoveWishController/AddOrRemoveWishController'

const wishSQLRepository = new WishSQLRepository()

const addOrRemoveUseCase = new AddOrRemoveWishUseCase(
  nodeUserContextAdapter,
  wishSQLRepository
)

export const addOrRemoveWishController = new AddOrRemoveWishController(
  addOrRemoveUseCase
)
