import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { Wish } from '@/Domain/Wish/Models/Wish'

export class WishRepositoryStub implements WishRepository {
  async save(params: {
    user_id: number
    product_ids: number[]
  }): Promise<void> {
    Promise.resolve()
  }
  async update(params: {
    user_id: number
    product_ids: number[]
  }): Promise<void> {
    Promise.resolve()
  }
  async getByUserId(userId: number): Promise<Wish | null> {
    return {
      created_at: 'any_date',
      id: 1,
      product_ids: [1, 2, 3],
      updated_at: 'any_date',
      user_id: 1
    }
  }
  async delete(userId: number): Promise<void> {
    Promise.resolve()
  }
}

export function createWishRepositoryStub(): WishRepository {
  return new WishRepositoryStub()
}
