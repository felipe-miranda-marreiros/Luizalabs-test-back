import { AddOrRemoveWishUseCase } from '@/Application/Modules/Wish/UseCases/AddOrRemoveWish'
import { nodeUserContextAdapter } from '@/Infrastructure/Context/NodeUserContextAdapter'
import { WishSQLRepository } from '@/Infrastructure/Database/Repositories/WishSQLRepository'
import { nodeMailerAdapter } from '@/Infrastructure/SMTP/NodeMailerAdapter'
import { AddOrRemoveWishController } from '@/Presentation/Controllers/AddOrRemoveWishController/AddOrRemoveWishController'

export const wishSQLRepository = new WishSQLRepository()

const addOrRemoveUseCase = new AddOrRemoveWishUseCase(
  nodeUserContextAdapter,
  wishSQLRepository,
  nodeMailerAdapter
)

export const addOrRemoveWishController = new AddOrRemoveWishController(
  addOrRemoveUseCase
)
