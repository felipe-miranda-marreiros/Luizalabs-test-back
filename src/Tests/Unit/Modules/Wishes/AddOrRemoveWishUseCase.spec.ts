import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { NotFoundError } from '@/Application/Contracts/Errors/NotFoundError'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { productService } from '@/Application/Modules/Products/Services/ProductService'
import { wishListService } from '@/Application/Modules/Wish/Services/WishListLimitService'
import { AddOrRemoveWishUseCase } from '@/Application/Modules/Wish/UseCases/AddOrRemoveWish'
import { AddOrRemoveWish } from '@/Domain/Wish/UseCases/AddOrRemoveWish'
import { createUserRepositoryMock } from '@/Tests/Mocks/Domain/User/UseCases'
import { createWishRepositoryStub } from '@/Tests/Mocks/Repositories/WishRepositoryMock'

const userContextStub: UserContext = {
  getLoggedInUser: () => createUserRepositoryMock,
  setLoggedInUser: () => {}
}

interface Sut {
  sut: AddOrRemoveWish
  wishRepositoryStub: WishRepository
}

function createSut(): Sut {
  const wishRepositoryStub = createWishRepositoryStub()
  const sut = new AddOrRemoveWishUseCase(userContextStub, wishRepositoryStub)
  return {
    sut,
    wishRepositoryStub
  }
}

describe('AddOrRemoveWish UseCase', () => {
  it('Should create a new wish list if none exists', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce(null)
    const saveSpy = jest.spyOn(wishRepositoryStub, 'save')
    const result = await sut.addOrRemove({ product_id: 1 })
    expect(saveSpy).toHaveBeenCalledWith({
      user_id: createUserRepositoryMock.id,
      product_ids: [1]
    })
    expect(result).toEqual({ items: [1], count: 1 })
  })

  it('Should remove product if it is already in wish list', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2, 3],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })
    const updateSpy = jest.spyOn(wishRepositoryStub, 'update')

    const result = await sut.addOrRemove({ product_id: 3 })

    expect(updateSpy).toHaveBeenCalledWith({
      user_id: createUserRepositoryMock.id,
      product_ids: [1, 2]
    })
    expect(result).toEqual({ items: [1, 2], count: 2 })
  })

  it('Should add product if it is not in wish list', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2, 3],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })

    jest.spyOn(productService, 'getById').mockResolvedValueOnce({
      category: 'any_category',
      description: 'any_desc',
      id: 4,
      image: 'any_image',
      price: 400,
      title: 'any_title'
    })

    const updateSpy = jest.spyOn(wishRepositoryStub, 'update')

    const result = await sut.addOrRemove({ product_id: 4 })
    expect(updateSpy).toHaveBeenCalledWith({
      user_id: createUserRepositoryMock.id,
      product_ids: [1, 2, 3, 4]
    })
    expect(result).toEqual({ items: [1, 2, 3, 4], count: 4 })
  })

  it('Should call productService.getById if product is not in list', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2, 3],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })
    const getByIdSpy = jest
      .spyOn(productService, 'getById')
      .mockResolvedValueOnce({
        category: 'any_category',
        description: 'any_desc',
        id: 4,
        image: 'any_image',
        price: 400,
        title: 'any_title'
      })

    await sut.addOrRemove({ product_id: 4 })
    expect(getByIdSpy).toHaveBeenCalledWith(4)
  })

  it('Should throw NotFoundError if product does not exist', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2, 3],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })
    jest.spyOn(productService, 'getById').mockResolvedValueOnce(null)

    const promise = sut.addOrRemove({ product_id: 30 })
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  it('Should call checkForListLimit when adding product', async () => {
    const { sut, wishRepositoryStub } = createSut()
    const checkSpy = jest.spyOn(wishListService, 'checkForListLimit')

    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 3, 2],
      updated_at: 'any_date',
      user_id: createUserRepositoryMock.id
    })
    jest.spyOn(productService, 'getById').mockResolvedValueOnce({
      category: 'any_category',
      description: 'any_desc',
      id: 4,
      image: 'any_image',
      price: 400,
      title: 'any_title'
    })

    await sut.addOrRemove({ product_id: 4 })
    expect(checkSpy).toHaveBeenCalledWith([1, 3, 2, 4])
  })
})
