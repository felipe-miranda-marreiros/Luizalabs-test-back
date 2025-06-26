import { expressControllerAdapter } from '@/Main/Libs/Express/ExpressControllerAdapter'
import { addOrRemoveWishController } from './Routes/AddOrRemoveWishRoute'
import { Router } from 'express'
import { removeWishListController } from './Routes/RemoveWishListRoute'

export const wishRouter = Router()

wishRouter.post(
  '/api/wish/:product_id',
  expressControllerAdapter(addOrRemoveWishController)
)

wishRouter.delete(
  '/api/wish',
  expressControllerAdapter(removeWishListController)
)
