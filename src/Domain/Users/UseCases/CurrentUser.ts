import { LoggedInUser } from '../Models/User'

export type CurrentUserReponse = LoggedInUser

export interface CurrentUser {
  getUser(): Promise<LoggedInUser>
}
