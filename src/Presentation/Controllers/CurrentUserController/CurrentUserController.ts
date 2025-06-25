import { LoggedInUser } from '@/Domain/Users/Models/User'
import { CurrentUser } from '@/Domain/Users/UseCases/CurrentUser'
import { Controller } from '@/Presentation/Contracts/Controller'
import {
  Cookies,
  Headers,
  HttpRequest,
  HttpResponse
} from '@/Presentation/Contracts/Http'

export class CurrentUserController implements Controller {
  constructor(private readonly currentUserUseCase: CurrentUser) {}

  async handle(
    request: HttpRequest,
    cookies: Cookies,
    headers: Headers
  ): Promise<HttpResponse<LoggedInUser>> {
    const loggedInUser = await this.currentUserUseCase.getUser()
    return {
      status_code: 200,
      body: loggedInUser
    }
  }
}
