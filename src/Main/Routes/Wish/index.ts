import { expressControllerAdapter } from '@/Main/Libs/Express/ExpressControllerAdapter'
import { addOrRemoveWishController } from './Routes/AddOrRemoveWishRoute'
import { removeWishListController } from './Routes/RemoveWishListRoute'
import { wishListController } from './Routes/WishListControllerRoute'
import { currentWishesRoute } from './Routes/CurrentWishesRoute'
import { Router } from 'express'

export const wishRouter = Router()

wishRouter.post(
  '/api/wish/:product_id',
  expressControllerAdapter(addOrRemoveWishController)
)

wishRouter.delete(
  '/api/wish',
  expressControllerAdapter(removeWishListController)
)

wishRouter.get('/api/wish', expressControllerAdapter(wishListController))

wishRouter.get('/api/wish/list', expressControllerAdapter(currentWishesRoute))
