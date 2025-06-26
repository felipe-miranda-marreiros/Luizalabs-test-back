import { CurrentWishes } from '@/Domain/Wish/UseCases/CurrentWishes'
import { Controller } from '@/Presentation/Contracts/Controller'
import {
  Cookies,
  Headers,
  HttpRequest,
  HttpResponse,
  Params
} from '@/Presentation/Contracts/Http'

export class CurrentWishesController implements Controller {
  constructor(private readonly currentWishesUseCase: CurrentWishes) {}

  async handle(
    request: HttpRequest,
    cookies: Cookies,
    headers: Headers,
    params: Params
  ): Promise<HttpResponse> {
    const wishes = await this.currentWishesUseCase.list()
    return {
      status_code: 200,
      body: wishes
    }
  }
}
