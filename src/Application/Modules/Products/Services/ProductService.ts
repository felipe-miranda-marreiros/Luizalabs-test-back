import { Product } from '@/Domain/Products/Models/Product'
import { redisAdapter } from '@/Infrastructure/Cache/RedisAdapter'
import axios from 'axios'

async function getById(id: number): Promise<Product | null> {
  try {
    const cacheKey = `product-${id}`
    const product = await redisAdapter.get<Product>(cacheKey)
    if (product) return product

    const response = await axios.get<Product>(
      `https://fakestoreapi.com/products/${id}`
    )
    await redisAdapter.set(cacheKey, response.data)
    return response.data
  } catch (error) {
    return null
  }
}

export const productService = {
  getById
}
