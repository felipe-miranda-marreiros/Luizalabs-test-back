import { createClient, RedisClientType } from 'redis'
import { Cache } from '../Contracts/Cache'
import { ENV } from '@/Shared/Env/Env'
import { logger } from '../Logger/PinoLoggerAdapter'

export const redisAdapter: Cache<RedisClientType> = {
  client: null as unknown as RedisClientType,

  build: async function () {
    try {
      this.client = createClient({
        url: ENV.REDIS_URL
      })
      await this.client.connect()
    } catch (error) {
      logger.error('Connection to Redis falied', error)
    }
  },

  set: async function <TData>(key: string, data: TData): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(data))
    } catch (error) {
      logger.error('Setting cache data falied', error)
    }
  },

  get: async function <TData>(key: string): Promise<TData | null> {
    try {
      const cacheData = await this.client.get(key)
      if (!cacheData) return null
      const parsedData: TData = JSON.parse(cacheData)
      return parsedData
    } catch (error) {
      logger.error('Getting cache data falied', error)
      return null
    }
  },

  invalidate: async function (key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      logger.error('Invalidating cache data falied', error)
    }
  }
}
