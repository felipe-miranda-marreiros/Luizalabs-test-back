import { CurrentUserUseCase } from '@/Application/Modules/Users/UseCases/CurrentUserUseCase'
import { nodeUserContextAdapter } from '@/Infrastructure/Context/NodeUserContextAdapter'
import { CurrentUserController } from '@/Presentation/Controllers/CurrentUserController/CurrentUserController'
import { AuthenticationMiddleware } from '@/Presentation/Middlewares/AuthenticationMiddleware'
import { AuthenticationUseCase } from '@/Application/Modules/Authentication/UseCases/AuthenticationUseCase'
import { jwtAdapter } from '@/Main/Dependencies/Infrastructure'

const authenticationUseCase = new AuthenticationUseCase(jwtAdapter)
export const authenticationMiddleware = new AuthenticationMiddleware(
  authenticationUseCase
)

const currentUserUsecase = new CurrentUserUseCase(nodeUserContextAdapter)
export const currentUserController = new CurrentUserController(
  currentUserUsecase
)
