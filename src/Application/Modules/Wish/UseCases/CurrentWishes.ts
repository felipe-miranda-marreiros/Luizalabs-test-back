import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { CurrentWishes } from '@/Domain/Wish/UseCases/CurrentWishes'
import { Wishes } from '@/Domain/Wish/Models/Wishes'

export class CurrentWishesUsecase implements CurrentWishes {
  constructor(
    private readonly userContext: UserContext,
    private readonly wishRepository: WishRepository
  ) {}

  async list(): Promise<Wishes> {
    const user = this.userContext.getLoggedInUser()
    const wishes = await this.wishRepository.getByUserId(user.id)

    if (!wishes) {
      return {
        count: 0,
        items: []
      }
    }

    return {
      count: wishes.product_ids.length,
      items: wishes.product_ids
    }
  }
}
