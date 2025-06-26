import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import {
  AddOrRemoveWish,
  AddOrRemoveWishParams,
  WishList
} from '@/Domain/Wish/UseCases/AddOrRemoveWish'

export class AddOrRemoveWishUseCase implements AddOrRemoveWish {
  constructor(
    private readonly userContext: UserContext,
    private readonly wishRepository: WishRepository
  ) {}

  async addOrRemove(params: AddOrRemoveWishParams): Promise<WishList> {
    const user = this.userContext.getLoggedInUser()
    const wishList = await this.wishRepository.getByUserId(user.id)

    let updatedProductIds: number[]

    if (!wishList) {
      updatedProductIds = [params.product_id]
      await this.wishRepository.save({
        user_id: user.id,
        product_ids: updatedProductIds
      })
    } else {
      const exists = wishList.product_ids.includes(params.product_id)

      updatedProductIds = exists
        ? wishList.product_ids.filter((id) => id !== params.product_id)
        : [...wishList.product_ids, params.product_id]

      await this.wishRepository.update({
        user_id: user.id,
        product_ids: updatedProductIds
      })
    }

    return {
      items: updatedProductIds,
      count: updatedProductIds.length
    }
  }
}
