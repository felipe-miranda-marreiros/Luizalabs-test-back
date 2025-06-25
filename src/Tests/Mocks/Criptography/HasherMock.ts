import { HashComparer } from '@/Application/Contracts/Criptography/HashComparer'
import { Hasher } from '@/Application/Contracts/Criptography/Hasher'

export function createHasherStub() {
  class HasherStub implements Hasher, HashComparer {
    compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
    hash(value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }
  return new HasherStub()
}
