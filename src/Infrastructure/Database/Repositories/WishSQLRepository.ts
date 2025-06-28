import { WishRepository } from '@/Application/Contracts/Repositories/WishRepository'
import { wishes_table } from '../Schemas/Schemas'
import { Wish } from '@/Domain/Wish/Models/Wish'
import { db } from '../Drizzle/DrizzleClient'
import { eq } from 'drizzle-orm'
import { redisAdapter } from '@/Infrastructure/Cache/RedisAdapter'

export class WishSQLRepository implements WishRepository {
  private getCacheKey(userId: number): string {
    return `wish:user:${userId}`
  }

  async update(params: {
    user_id: number
    product_ids: number[]
  }): Promise<void> {
    await db
      .update(wishes_table)
      .set({
        product_ids: params.product_ids,
        user_id: params.user_id
      })
      .where(eq(wishes_table.user_id, params.user_id))
    await redisAdapter.invalidate(this.getCacheKey(params.user_id))
  }

  async delete(userId: number): Promise<void> {
    await db.delete(wishes_table).where(eq(wishes_table.user_id, userId))
    await redisAdapter.invalidate(this.getCacheKey(userId))
  }

  async save(params: {
    user_id: number
    product_ids: number[]
  }): Promise<void> {
    await db.insert(wishes_table).values({
      product_ids: params.product_ids,
      user_id: params.user_id
    })
    await redisAdapter.invalidate(this.getCacheKey(params.user_id))
  }

  async getByUserId(userId: number): Promise<Wish | null> {
    const cacheData = await redisAdapter.get<Wish>(this.getCacheKey(userId))

    if (cacheData) return cacheData

    const wishes = await db
      .select()
      .from(wishes_table)
      .where(eq(wishes_table.user_id, userId))

    if (wishes.length <= 0) return null

    const wish: Wish = {
      created_at: wishes[0].created_at.toISOString(),
      id: wishes[0].id,
      product_ids: wishes[0].product_ids,
      updated_at: wishes[0].updated_at.toISOString(),
      user_id: wishes[0].user_id
    }

    await redisAdapter.set(this.getCacheKey(userId), wish)

    return wish
  }
}
