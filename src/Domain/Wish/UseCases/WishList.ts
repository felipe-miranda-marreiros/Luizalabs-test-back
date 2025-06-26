import { Product } from '@/Domain/Products/Models/Product'

export interface WishList {
  list(): Promise<Product[]>
}
