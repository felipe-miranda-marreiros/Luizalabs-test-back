import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { PartialUser } from '@/Domain/Users/Models/User'
import { CurrentUser } from '@/Domain/Users/UseCases/CurrentUser'
import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'

export class CurrentUserUseCase implements CurrentUser {
  constructor(private readonly userContext: UserContext) {}

  getUser(): Promise<PartialUser> {
    logger.info(`Current user process started`)
    const user = this.userContext.getLoggedInUser()
    logger.info(`Current user process finished`)
    return Promise.resolve(user)
  }
}
