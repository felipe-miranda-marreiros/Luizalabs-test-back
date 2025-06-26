import { WishListUseCase } from '@/Application/Modules/Wish/UseCases/WishList'
import { nodeUserContextAdapter } from '@/Infrastructure/Context/NodeUserContextAdapter'
import { WishListController } from '@/Presentation/Controllers/WishListController/WishListController'
import { wishSQLRepository } from './AddOrRemoveWishRoute'

const wishListUseCase = new WishListUseCase(
  nodeUserContextAdapter,
  wishSQLRepository
)

export const wishListController = new WishListController(wishListUseCase)
