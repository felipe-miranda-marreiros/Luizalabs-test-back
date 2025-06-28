import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { CurrentWishesUsecase } from '@/Application/Modules/Wish/UseCases/CurrentWishes'
import { CurrentWishes } from '@/Domain/Wish/UseCases/CurrentWishes'
import { createUserRepositoryMock } from '@/Tests/Mocks/Domain/User/UseCases'
import { createWishRepositoryStub } from '@/Tests/Mocks/Repositories/WishRepositoryMock'

const userContextStub: UserContext = {
  getLoggedInUser: () => createUserRepositoryMock,
  setLoggedInUser: () => {}
}

interface Sut {
  sut: CurrentWishes
  wishRepositoryStub: WishRepository
}

function createSut(): Sut {
  const wishRepositoryStub = createWishRepositoryStub()
  const sut = new CurrentWishesUsecase(userContextStub, wishRepositoryStub)
  return {
    sut,
    wishRepositoryStub
  }
}

describe('CurrentWishes Usecase', () => {
  it('Should return empty list if user has no wishes', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })
    const result = await sut.list()
    expect(result).toEqual({
      count: 0,
      items: []
    })
  })

  it('Should call getByUserId with correct user id', async () => {
    const { sut, wishRepositoryStub } = createSut()
    const getByUserIdspy = jest.spyOn(wishRepositoryStub, 'getByUserId')
    await sut.list()
    expect(getByUserIdspy).toHaveBeenCalledWith(createUserRepositoryMock.id)
  })

  it('Should return wishes with correct count and items if wish list exists', async () => {
    const { sut, wishRepositoryStub } = createSut()

    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2, 3],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })

    const result = await sut.list()

    expect(result).toEqual({
      count: 3,
      items: [1, 2, 3]
    })
  })
})
