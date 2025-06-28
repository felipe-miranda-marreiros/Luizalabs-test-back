import { createWishRepositoryStub } from '@/Tests/Mocks/Repositories/WishRepositoryMock'
import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { createUserRepositoryMock } from '@/Tests/Mocks/Domain/User/UseCases'
import { WishListUseCase } from '@/Application/Modules/Wish/UseCases/WishList'
import { productService } from '@/Application/Modules/Products/Services/ProductService'

jest.mock('@/Application/Modules/Products/Services/ProductService', () => ({
  productService: {
    getById: jest.fn()
  }
}))

const userContextStub: UserContext = {
  getLoggedInUser: () => createUserRepositoryMock,
  setLoggedInUser: () => {}
}

function createSut() {
  const wishRepositoryStub = createWishRepositoryStub()
  const sut = new WishListUseCase(userContextStub, wishRepositoryStub)
  return {
    sut,
    userContextStub,
    wishRepositoryStub
  }
}

describe('WishList UseCase', () => {
  it('Should return empty array if no wish list is found', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce(null)
    const result = await sut.list()
    expect(result).toEqual([])
  })

  it('Should call getByUserId with correct user id', async () => {
    const { sut, wishRepositoryStub } = createSut()
    const spy = jest.spyOn(wishRepositoryStub, 'getByUserId')
    await sut.list()
    expect(spy).toHaveBeenCalledWith(createUserRepositoryMock.id)
  })

  it('should call productService.getById for each product_id', async () => {
    const { sut, wishRepositoryStub } = createSut()
    const productIds = [1, 2, 3]
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: productIds,
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })
    const getByIdSpy = jest.spyOn(productService, 'getById')
    await sut.list()
    productIds.forEach((id) => {
      expect(getByIdSpy).toHaveBeenCalledWith(id)
    })
  })

  it('Should filter out null products from results', async () => {
    const { sut, wishRepositoryStub } = createSut()

    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })

    jest
      .spyOn(productService, 'getById')
      .mockResolvedValueOnce({
        category: 'any_category',
        description: 'any_desc',
        id: 1,
        image: 'any_image',
        price: 400,
        title: 'any_title'
      })
      .mockResolvedValueOnce(null)

    const result = await sut.list()
    expect(result).toHaveLength(1)
  })
})
