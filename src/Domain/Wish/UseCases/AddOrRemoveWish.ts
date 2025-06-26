export interface WishList {
  count: number
  items: number[]
}

export interface AddOrRemoveWishParams {
  product_id: number
}

export interface AddOrRemoveWish {
  addOrRemove(params: AddOrRemoveWishParams): Promise<WishList>
}
