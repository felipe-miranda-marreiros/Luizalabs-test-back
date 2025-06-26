import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import {
  AddOrRemoveWish,
  AddOrRemoveWishParams
} from '@/Domain/Wish/UseCases/AddOrRemoveWish'
import { wishListService } from '../Services/WishListLimitService'
import { productService } from '../../Products/Services/ProductService'
import { NotFoundError } from '@/Application/Contracts/Errors/NotFoundError'
import { Wishes } from '@/Domain/Wish/Models/Wishes'

export class AddOrRemoveWishUseCase implements AddOrRemoveWish {
  constructor(
    private readonly userContext: UserContext,
    private readonly wishRepository: WishRepository
  ) {}

  async addOrRemove(params: AddOrRemoveWishParams): Promise<Wishes> {
    const user = this.userContext.getLoggedInUser()
    const wishList = await this.wishRepository.getByUserId(user.id)
    if (wishList) {
      return this.updateExistingWishList(wishList, user.id, params.product_id)
    }
    return this.createWishList(user.id, params.product_id)
  }

  private async ensureProductExists(productId: number) {
    const product = await productService.getById(productId)
    if (!product) {
      throw new NotFoundError('Produto não foi encontrado')
    }
    return product
  }

  private async updateExistingWishList(
    wishList: { product_ids: number[] },
    userId: number,
    productId: number
  ): Promise<Wishes> {
    const isInWishList = wishList.product_ids.includes(productId)

    let updatedProductIds: number[]

    if (isInWishList) {
      updatedProductIds = wishList.product_ids.filter((id) => id !== productId)
    } else {
      const product = await this.ensureProductExists(productId)
      updatedProductIds = [...wishList.product_ids, product.id]
      updatedProductIds = wishListService.checkForListLimit(updatedProductIds)
    }

    await this.wishRepository.update({
      user_id: userId,
      product_ids: updatedProductIds
    })

    return this.buildWishList(updatedProductIds)
  }

  private buildWishList(productIds: number[]): Wishes {
    return {
      items: productIds,
      count: productIds.length
    }
  }

  private async createWishList(
    userId: number,
    productId: number
  ): Promise<Wishes> {
    await this.wishRepository.save({
      user_id: userId,
      product_ids: [productId]
    })

    return this.buildWishList([productId])
  }
}
