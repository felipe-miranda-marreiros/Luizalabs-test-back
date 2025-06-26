import { Product } from '@/Domain/Products/Models/Product'
import { WishList } from '@/Domain/Wish/UseCases/WishList'
import { Controller } from '@/Presentation/Contracts/Controller'
import {
  Cookies,
  Headers,
  HttpRequest,
  HttpResponse,
  Params
} from '@/Presentation/Contracts/Http'

export class WishListController implements Controller {
  constructor(private readonly wishListUseCase: WishList) {}

  async handle(
    request: HttpRequest,
    cookies: Cookies,
    headers: Headers,
    params: Params
  ): Promise<HttpResponse<Product[]>> {
    const products = await this.wishListUseCase.list()
    return {
      status_code: 200,
      body: products
    }
  }
}
