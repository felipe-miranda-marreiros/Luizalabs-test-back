import { Encrypter } from '@/Application/Contracts/Criptography/Encrypter'

export function createEncrypterStub() {
  class EncrypterStub implements Encrypter {
    async encrypt<TData extends Object>(value: TData): Promise<string> {
      return Promise.resolve('encrypted_value')
    }
  }
  return new EncrypterStub()
}
