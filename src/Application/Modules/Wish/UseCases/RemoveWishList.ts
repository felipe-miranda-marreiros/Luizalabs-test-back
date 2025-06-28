import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { NotFoundError } from '@/Application/Contracts/Errors/NotFoundError'
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
      throw new NotFoundError('Nenhum lista de favoritos encontrada')
    }
    await this.wishRepository.delete(user.id)
  }
}
