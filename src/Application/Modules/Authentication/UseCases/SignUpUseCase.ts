import { Encrypter } from '@/Application/Contracts/Criptography/Encrypter'
import { Hasher } from '@/Application/Contracts/Criptography/Hasher'
import { ConflictError } from '@/Application/Contracts/Errors/ConflictError'
import { UserRepository } from '@/Application/Contracts/Repositories/UserRepository'
import {
  SignUp,
  SignUpParams,
  SignUpResponse
} from '@/Domain/Authentication/UseCases/SignUp'
import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'

export class SignUpUseCase implements SignUp {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher,
    private readonly encrypter: Encrypter
  ) {}

  async signUp(params: SignUpParams): Promise<SignUpResponse> {
    logger.info('Sign up process started with', params)

    logger.info(`Checking if email: ${params.email} is already in use`)
    const isEmailInUse = await this.userRepository.isEmailInUse(params.email)

    if (isEmailInUse) {
      logger.warn(`Email: ${params.email} is already in use`)
      throw new ConflictError(`Este email já está em uso: ${params.email}`)
    }

    logger.info(`Hashing password process started`)
    const hashedPassword = await this.hasher.hash(params.password)
    logger.info(`Hashing password process Finished`)

    logger.info(`Creating user with hashed password`)
    const user = await this.userRepository.createUser({
      ...params,
      password: hashedPassword
    })
    logger.info(`Creating user with hashed password finished`)

    logger.info(`Creating jwt process started`)
    const token = await this.encrypter.encrypt(user)

    logger.info(`Sign up process finished successfully`)

    return {
      token
    }
  }
}
