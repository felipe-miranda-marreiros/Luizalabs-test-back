import { AsyncLocalStorage } from 'node:async_hooks'
import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { ForbiddenError } from '@/Application/Contracts/Errors/ForbbidenError'
import { LoggedInUser } from '@/Domain/Users/Models/User'

const asyncLocalStorage = new AsyncLocalStorage<Map<string, LoggedInUser>>()
const CONTEXT_STORAGE_KEY = 'user_context'

export const nodeUserContextAdapter: UserContext = {
  getLoggedInUser(): LoggedInUser {
    const loggedInUser = asyncLocalStorage.getStore()?.get(CONTEXT_STORAGE_KEY)
    if (loggedInUser) return loggedInUser
    throw new ForbiddenError()
  },
  setLoggedInUser(user: LoggedInUser, callback: () => void): void {
    asyncLocalStorage.run(new Map(), () => {
      asyncLocalStorage.getStore()?.set(CONTEXT_STORAGE_KEY, user)
      callback()
    })
  }
}
