import { Product } from '@/Domain/Products/Models/Product'
import axios from 'axios'

async function getById(id: number): Promise<Product | null> {
  try {
    const response = await axios.get<Product>(
      `https://fakestoreapi.com/products/${id}`
    )
    return response.data
  } catch (error) {
    return null
  }
}

export const productService = {
  getById
}
