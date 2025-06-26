import { RemoveWishListUseCase } from '@/Application/Modules/Wish/UseCases/RemoveWishList'
import { nodeUserContextAdapter } from '@/Infrastructure/Context/NodeUserContextAdapter'
import { RemoveWishListController } from '@/Presentation/Controllers/RemoveWishListController/RemoveWishListController'
import { wishSQLRepository } from './AddOrRemoveWishRoute'

const removeWishListUseCase = new RemoveWishListUseCase(
  nodeUserContextAdapter,
  wishSQLRepository
)

export const removeWishListController = new RemoveWishListController(
  removeWishListUseCase
)
