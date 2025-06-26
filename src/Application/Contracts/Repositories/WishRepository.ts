import { Wish } from '@/Domain/Wish/Models/Wish'

export interface WishRepository {
  save(params: { user_id: number; product_ids: number[] }): Promise<void>
  update(params: { user_id: number; product_ids: number[] }): Promise<void>
  getByUserId(userId: number): Promise<Wish | null>
  delete(userId: number): Promise<void>
}
