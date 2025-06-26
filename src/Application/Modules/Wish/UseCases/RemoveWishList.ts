import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { RemoveWishList } from '@/Domain/Wish/UseCases/RemoveWishList'

export class RemoveWishListUseCase implements RemoveWishList {
  constructor(
    private readonly userContext: UserContext,
    private readonly wishRepository: WishRepository
  ) {}

  async remove(): Promise<void> {
    const user = this.userContext.getLoggedInUser()
    const wishList = await this.wishRepository.getByUserId(user.id)
    if (!wishList) {
      return
    }
    await this.wishRepository.delete(user.id)
  }
}
