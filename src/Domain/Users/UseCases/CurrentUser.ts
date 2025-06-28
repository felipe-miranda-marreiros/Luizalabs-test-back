import { PartialUser } from '../Models/User'

export type CurrentUserReponse = PartialUser

export interface CurrentUser {
  getUser(): Promise<PartialUser>
}
