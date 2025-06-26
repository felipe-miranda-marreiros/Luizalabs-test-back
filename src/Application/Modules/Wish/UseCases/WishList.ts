import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { Product } from '@/Domain/Products/Models/Product'
import { WishList } from '@/Domain/Wish/UseCases/WishList'
import { productService } from '../../Products/Services/ProductService'

export class WishListUseCase implements WishList {
  constructor(
    private readonly userContext: UserContext,
    private readonly wishRepository: WishRepository
  ) {}

  async list(): Promise<Product[]> {
    const user = this.userContext.getLoggedInUser()
    const wishList = await this.wishRepository.getByUserId(user.id)
    if (!wishList) {
      return []
    }
    const productPromises = wishList.product_ids.map(async (id) =>
      productService.getById(id)
    )
    const products = await Promise.all(productPromises)
    return products.filter((product) => product !== null)
  }
}
