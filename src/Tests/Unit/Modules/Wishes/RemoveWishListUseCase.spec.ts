import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { NotFoundError } from '@/Application/Contracts/Errors/NotFoundError'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { RemoveWishListUseCase } from '@/Application/Modules/Wish/UseCases/RemoveWishList'
import { RemoveWishList } from '@/Domain/Wish/UseCases/RemoveWishList'
import { createUserRepositoryMock } from '@/Tests/Mocks/Domain/User/UseCases'
import { createWishRepositoryStub } from '@/Tests/Mocks/Repositories/WishRepositoryMock'

const userContextStub: UserContext = {
  getLoggedInUser: () => createUserRepositoryMock,
  setLoggedInUser: () => {}
}

interface Sut {
  sut: RemoveWishList
  wishRepositoryStub: WishRepository
  userContextStub: UserContext
}

function createSut(): Sut {
  const wishRepositoryStub = createWishRepositoryStub()
  const sut = new RemoveWishListUseCase(userContextStub, wishRepositoryStub)
  return {
    sut,
    userContextStub,
    wishRepositoryStub
  }
}

describe('RemoveWishList UseCase', () => {
  it('Should return NotFoundError if wish list does not exist', async () => {
    const { sut, wishRepositoryStub } = createSut()
    const deleteSpy = jest.spyOn(wishRepositoryStub, 'delete')
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce(null)
    const promise = sut.remove()
    expect(deleteSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  it('Should call getByUserId with correct user id', async () => {
    const { sut, wishRepositoryStub } = createSut()
    const spy = jest.spyOn(wishRepositoryStub, 'getByUserId')
    await sut.remove()
    expect(spy).toHaveBeenCalledWith(createUserRepositoryMock.id)
  })

  it('Should call delete if wish list exists', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2, 3],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })
    const deleteSpy = jest.spyOn(wishRepositoryStub, 'delete')
    await sut.remove()
    expect(deleteSpy).toHaveBeenCalledWith(createUserRepositoryMock.id)
  })
})
