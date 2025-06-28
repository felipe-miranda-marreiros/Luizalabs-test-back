import { PartialUser } from '@/Domain/Users/Models/User'

export interface UserContext {
  getLoggedInUser(): PartialUser
  setLoggedInUser(user: PartialUser, callback: () => void): void
}
