import { LoggedInUser } from '@/Domain/Users/Models/User'

export interface UserContext {
  getLoggedInUser(): LoggedInUser
  setLoggedInUser(user: LoggedInUser, callback: () => void): void
}
