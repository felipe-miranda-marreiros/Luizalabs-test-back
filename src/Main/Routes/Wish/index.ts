import { expressControllerAdapter } from '@/Main/Libs/Express/ExpressControllerAdapter'
import { addOrRemoveWishController } from './Routes/AddOrRemoveWishRoute'
import { Router } from 'express'

export const wishRouter = Router()

wishRouter.post(
  '/api/wish/:product_id',
  expressControllerAdapter(addOrRemoveWishController)
)
