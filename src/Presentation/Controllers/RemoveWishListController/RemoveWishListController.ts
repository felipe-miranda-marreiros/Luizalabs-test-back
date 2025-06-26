import { RemoveWishListUseCase } from '@/Application/Modules/Wish/UseCases/RemoveWishList'

import { Controller } from '@/Presentation/Contracts/Controller'
import {
  Cookies,
  Headers,
  HttpRequest,
  HttpResponse,
  Params
} from '@/Presentation/Contracts/Http'

export class RemoveWishListController implements Controller {
  constructor(private readonly removeWishListUseCase: RemoveWishListUseCase) {}

  async handle(
    request: HttpRequest,
    cookies: Cookies,
    headers: Headers,
    params: Params
  ): Promise<HttpResponse> {
    await this.removeWishListUseCase.remove()
    return {
      status_code: 200
    }
  }
}
