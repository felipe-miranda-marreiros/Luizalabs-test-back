import { BcryptAdapter } from '@/Infrastructure/Cryptography/BcryptAdapter'
import { JwtAdapter } from '@/Infrastructure/Cryptography/JwtAdapter'
import { ENV } from '@/Shared/Env/Env'

export const bcryptAdapter = new BcryptAdapter(12)
export const jwtAdapter = new JwtAdapter(ENV.JWT_SECRET)
