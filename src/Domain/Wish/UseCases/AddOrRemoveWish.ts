import { Wishes } from '../Models/Wishes'

export interface AddOrRemoveWishParams {
  product_id: number
}

export interface AddOrRemoveWish {
  addOrRemove(params: AddOrRemoveWishParams): Promise<Wishes>
}
