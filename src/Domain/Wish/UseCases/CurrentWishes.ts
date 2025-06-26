import { Wishes } from '../Models/Wishes'

export interface CurrentWishes {
  list(): Promise<Wishes>
}
