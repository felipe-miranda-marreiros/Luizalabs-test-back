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
import { SMTP } from '@/Application/Contracts/SMTP/SMTP'
import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'

export class AddOrRemoveWishUseCase implements AddOrRemoveWish {
  constructor(
    private readonly userContext: UserContext,
    private readonly wishRepository: WishRepository,
    private readonly smtpService: SMTP
  ) {}

  async addOrRemove(params: AddOrRemoveWishParams): Promise<Wishes> {
    const user = this.userContext.getLoggedInUser()
    logger.info(`User: (${user.id}) started AddOrRemove use case`)

    logger.info(`Checking if user has a wish list`)
    const wishList = await this.wishRepository.getByUserId(user.id)
    logger.info(`Finished checking if user has a wish list`)

    if (wishList) {
      logger.info(`User already have a wish list. Updating list.`)
      return await this.updateExistingWishList(
        wishList,
        user.id,
        params.product_id
      )
    }
    return this.createWishList(user.id, params.product_id)
  }

  private async ensureProductExists(productId: number) {
    const product = await productService.getById(productId)
    if (!product) {
      logger.info(`Product with id (${productId}) does not exists`)
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
      logger.info(`Product with id (${productId}) already exist`)
      updatedProductIds = wishList.product_ids.filter((id) => id !== productId)
    } else {
      logger.info(`Check if Product with id (${productId}) exists`)
      const product = await this.ensureProductExists(productId)
      updatedProductIds = [...wishList.product_ids, product.id]
      updatedProductIds = wishListService.checkForListLimit(updatedProductIds)
    }

    logger.info(`Updating wish list with product_id (${productId})`)
    await this.wishRepository.update(
      {
        user_id: userId,
        product_ids: updatedProductIds
      },
      !isInWishList ? this.deliverWishProductEmail(productId) : undefined
    )

    return this.buildWishList(updatedProductIds)
  }

  private buildWishList(productIds: number[]): Wishes {
    logger.info(`AddOrRemove usecase finished`, productIds)
    return {
      items: productIds,
      count: productIds.length
    }
  }

  private async deliverWishProductEmail(productId: number) {
    const user = this.userContext.getLoggedInUser()
    logger.info(`Sending e-mail for (${user.id}) with product_id: ${productId}`)
    const product = await productService.getById(productId)

    await this.smtpService.deliver({
      from: 'luizalabs-test@mail.com',
      subject: `Produto adicionado aos favoritos`,
      text: `Você adicionou o produto ${product?.title}`,
      to: user.email
    })

    logger.info(
      `Finished sending e-mail for (${user.id}) with product_id: ${productId}`
    )
  }

  private async createWishList(
    userId: number,
    productId: number
  ): Promise<Wishes> {
    logger.info(`Creating wish list for the first time`)
    await this.wishRepository.save({
      user_id: userId,
      product_ids: [productId]
    })

    logger.info(`Sending e-mail for (${userId}) with product_id: ${productId}`)
    await this.deliverWishProductEmail(productId)

    logger.info(
      `Finished sending e-mail for (${userId}) with product_id: ${productId}`
    )
    return this.buildWishList([productId])
  }
}
