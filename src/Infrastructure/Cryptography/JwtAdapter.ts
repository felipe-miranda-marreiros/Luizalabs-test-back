import { Decrypter } from '@/Application/Contracts/Criptography/Decrypter'
import { Encrypter } from '@/Application/Contracts/Criptography/Encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async decrypt<TData>(value: string): Promise<TData> {
    const decryptedValue = jwt.verify(value, this.secret)
    return Promise.resolve(decryptedValue as TData)
  }

  async encrypt<TData extends Object>(value: TData): Promise<string> {
    const encryptedValue = jwt.sign(value, this.secret)
    return Promise.resolve(encryptedValue)
  }
}
