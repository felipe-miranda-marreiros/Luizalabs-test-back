import bcrypt from 'bcrypt'
import { HashComparer } from '@/Application/Contracts/Criptography/HashComparer'
import { Hasher } from '@/Application/Contracts/Criptography/Hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
