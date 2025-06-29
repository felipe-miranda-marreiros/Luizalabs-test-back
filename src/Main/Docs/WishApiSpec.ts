import { Product } from '@/Domain/Products/Models/Product'
import { Wishes } from '@/Domain/Wish/Models/Wishes'
import { Tspec } from 'tspec'

export type WishApiSpec = Tspec.DefineApiSpec<{
  security: 'cookieAuth'
  basePath: '/api/wish'
  tags: ['Wish']
  paths: {
    '/product/{product_id}': {
      post: {
        summary: 'Add or remove product to wish list'
        responses: { 200: Wishes }
        path: {
          product_id: number
        }
      }
    }
    '/': {
      delete: {
        summary: 'Delete and remove products from wish list'
        responses: { 200: {} }
      }
    }
    '/products': {
      get: {
        summary: 'List all products from wish list'
        responses: { 200: Product[] }
      }
    }
    '/current': {
      get: {
        summary: 'Get products count and items from wish list'
        responses: { 200: Wishes }
      }
    }
  }
}>
