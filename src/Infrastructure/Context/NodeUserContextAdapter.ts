import { AsyncLocalStorage } from 'node:async_hooks'
import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { ForbiddenError } from '@/Application/Contracts/Errors/ForbbidenError'
import { PartialUser } from '@/Domain/Users/Models/User'

const asyncLocalStorage = new AsyncLocalStorage<Map<string, PartialUser>>()
const CONTEXT_STORAGE_KEY = 'user_context'

export const nodeUserContextAdapter: UserContext = {
  getLoggedInUser(): PartialUser {
    const loggedInUser = asyncLocalStorage.getStore()?.get(CONTEXT_STORAGE_KEY)
    if (loggedInUser) return loggedInUser
    throw new ForbiddenError()
  },
  setLoggedInUser(user: PartialUser, callback: () => void): void {
    asyncLocalStorage.run(new Map(), () => {
      asyncLocalStorage.getStore()?.set(CONTEXT_STORAGE_KEY, user)
      callback()
    })
  }
}
