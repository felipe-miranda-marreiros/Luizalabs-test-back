import { LoggedInUser } from '@/Domain/Users/Models/User'
import { Request } from 'express'

export type RequestWithUser = Request & {
  current_user?: LoggedInUser
}
