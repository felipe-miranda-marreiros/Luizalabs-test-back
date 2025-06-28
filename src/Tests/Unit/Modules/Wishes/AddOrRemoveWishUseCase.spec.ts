import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { NotFoundError } from '@/Application/Contracts/Errors/NotFoundError'
import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { SMTP } from '@/Application/Contracts/SMTP/SMTP'
import { productService } from '@/Application/Modules/Products/Services/ProductService'
import { wishListService } from '@/Application/Modules/Wish/Services/WishListLimitService'
import { AddOrRemoveWishUseCase } from '@/Application/Modules/Wish/UseCases/AddOrRemoveWish'
import { AddOrRemoveWish } from '@/Domain/Wish/UseCases/AddOrRemoveWish'
import { createUserRepositoryMock } from '@/Tests/Mocks/Domain/User/UseCases'
import { createWishRepositoryStub } from '@/Tests/Mocks/Repositories/WishRepositoryMock'

jest.mock('@/Application/Modules/Products/Services/ProductService', () => ({
  productService: {
    getById: jest.fn()
  }
}))

const userContextStub: UserContext = {
  getLoggedInUser: () => createUserRepositoryMock,
  setLoggedInUser: () => {}
}

interface Sut {
  sut: AddOrRemoveWish
  wishRepositoryStub: WishRepository
  smtpStub: SMTP
}

const smtpStub: SMTP = {
  deliver: jest.fn().mockResolvedValue(undefined)
}

function createSut(): Sut {
  const wishRepositoryStub = createWishRepositoryStub()
  const sut = new AddOrRemoveWishUseCase(
    userContextStub,
    wishRepositoryStub,
    smtpStub
  )
  return {
    sut,
    wishRepositoryStub,
    smtpStub
  }
}

describe('AddOrRemoveWishUseCase', () => {
  it('Should create a new wish list if none exists', async () => {
    const { sut, wishRepositoryStub, smtpStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce(null)
    jest.spyOn(productService, 'getById').mockResolvedValueOnce({
      category: 'any_category',
      description: 'any_desc',
      id: 1,
      image: 'any_image',
      price: 400,
      title: 'any_title'
    })

    const saveSpy = jest.spyOn(wishRepositoryStub, 'save')
    const deliverSpy = jest.spyOn(smtpStub, 'deliver')

    const result = await sut.addOrRemove({ product_id: 1 })

    expect(saveSpy).toHaveBeenCalledWith({
      user_id: createUserRepositoryMock.id,
      product_ids: [1]
    })
    expect(deliverSpy).toHaveBeenCalled()
    expect(result).toEqual({ items: [1], count: 1 })
  })

  it('Should remove product if it is already in wish list', async () => {
    const { sut, wishRepositoryStub, smtpStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      id: 1,
      created_at: 'any',
      updated_at: 'any',
      user_id: createUserRepositoryMock.id,
      product_ids: [1, 2, 3]
    })

    const updateSpy = jest.spyOn(wishRepositoryStub, 'update')
    const deliverSpy = jest.spyOn(smtpStub, 'deliver')

    const result = await sut.addOrRemove({ product_id: 2 })

    expect(updateSpy).toHaveBeenCalledWith(
      {
        user_id: createUserRepositoryMock.id,
        product_ids: [1, 3]
      },
      undefined // email não é enviado ao remover
    )
    expect(deliverSpy).not.toHaveBeenCalled()
    expect(result).toEqual({ items: [1, 3], count: 2 })
  })

  it('Should add product if it is not in wish list', async () => {
    const { sut, wishRepositoryStub, smtpStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      id: 1,
      created_at: 'any',
      updated_at: 'any',
      user_id: createUserRepositoryMock.id,
      product_ids: [1, 2]
    })

    jest.spyOn(productService, 'getById').mockResolvedValueOnce({
      id: 3,
      category: 'cat',
      description: 'desc',
      image: 'img',
      price: 100,
      title: 'title'
    })

    const updateSpy = jest.spyOn(wishRepositoryStub, 'update')
    const deliverSpy = jest.spyOn(smtpStub, 'deliver')

    const result = await sut.addOrRemove({ product_id: 3 })

    expect(updateSpy).toHaveBeenCalled()
    expect(deliverSpy).toHaveBeenCalled()
    expect(result).toEqual({ items: [1, 2, 3], count: 3 })
  })

  it('Should throw NotFoundError if product does not exist when adding', async () => {
    const { sut, wishRepositoryStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      id: 1,
      created_at: 'any',
      updated_at: 'any',
      user_id: createUserRepositoryMock.id,
      product_ids: [1, 2]
    })

    jest.spyOn(productService, 'getById').mockResolvedValueOnce(null)

    const promise = sut.addOrRemove({ product_id: 3 })
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  it('Should call wishListService.checkForListLimit on add', async () => {
    const { sut, wishRepositoryStub } = createSut()
    const checkSpy = jest.spyOn(wishListService, 'checkForListLimit')

    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce({
      id: 1,
      created_at: 'any',
      updated_at: 'any',
      user_id: createUserRepositoryMock.id,
      product_ids: [1, 2]
    })

    jest.spyOn(productService, 'getById').mockResolvedValueOnce({
      id: 3,
      category: 'cat',
      description: 'desc',
      image: 'img',
      price: 100,
      title: 'title'
    })

    await sut.addOrRemove({ product_id: 3 })

    expect(checkSpy).toHaveBeenCalledWith([1, 2, 3])
  })

  it('Should send email when product is added to wish list', async () => {
    const { sut, wishRepositoryStub, smtpStub } = createSut()
    jest.spyOn(wishRepositoryStub, 'getByUserId').mockResolvedValueOnce(null)
    jest.spyOn(productService, 'getById').mockResolvedValueOnce({
      id: 1,
      category: 'cat',
      description: 'desc',
      image: 'img',
      price: 100,
      title: 'product title'
    })

    const deliverSpy = jest.spyOn(smtpStub, 'deliver')

    await sut.addOrRemove({ product_id: 1 })

    expect(deliverSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: createUserRepositoryMock.email,
        subject: expect.stringContaining('Produto adicionado'),
        text: expect.stringContaining('product title')
      })
    )
  })
})
