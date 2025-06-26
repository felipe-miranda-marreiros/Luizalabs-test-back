import { BadRequestError } from '@/Application/Contracts/Errors/BadRequestError'
import { Wishes } from '@/Domain/Wish/Models/Wishes'
import { AddOrRemoveWish } from '@/Domain/Wish/UseCases/AddOrRemoveWish'
import { Controller } from '@/Presentation/Contracts/Controller'
import {
  Cookies,
  Headers,
  HttpRequest,
  HttpResponse,
  Params
} from '@/Presentation/Contracts/Http'

export class AddOrRemoveWishController implements Controller {
  constructor(private readonly addOrRemoveWishUseCase: AddOrRemoveWish) {}

  async handle(
    request: HttpRequest,
    cookies: Cookies,
    headers: Headers,
    params: Params<{ product_id: string }>
  ): Promise<HttpResponse<Wishes>> {
    if (!params.data.product_id) {
      throw new BadRequestError('Product id is required to complete operation')
    }
    const wishList = await this.addOrRemoveWishUseCase.addOrRemove({
      product_id: parseInt(params.data.product_id)
    })
    return {
      status_code: 200,
      body: wishList
    }
  }
}
