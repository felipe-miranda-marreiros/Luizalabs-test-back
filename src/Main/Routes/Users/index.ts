import { expressControllerAdapter } from '@/Main/Libs/Express/ExpressControllerAdapter'
import { Router } from 'express'
import { currentUserController } from './Routes/CurrentUserRoute'

export const userRouter = Router()

userRouter.get(
  '/api/users/current-user',
  expressControllerAdapter(currentUserController)
)
