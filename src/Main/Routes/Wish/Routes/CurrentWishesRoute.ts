import { CurrentWishesUsecase } from '@/Application/Modules/Wish/UseCases/CurrentWishes'
import { nodeUserContextAdapter } from '@/Infrastructure/Context/NodeUserContextAdapter'
import { CurrentWishesController } from '@/Presentation/Controllers/CurrentWishesController/CurrentWishesController'
import { wishSQLRepository } from './AddOrRemoveWishRoute'

const currentWishesUseCase = new CurrentWishesUsecase(
  nodeUserContextAdapter,
  wishSQLRepository
)
export const currentWishesRoute = new CurrentWishesController(
  currentWishesUseCase
)
