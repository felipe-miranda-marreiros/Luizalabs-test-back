import { Encrypter } from '@/Application/Contracts/Criptography/Encrypter'
import { HashComparer } from '@/Application/Contracts/Criptography/HashComparer'
import { NotFoundError } from '@/Application/Contracts/Errors/NotFoundError'
import { UnauthorizedError } from '@/Application/Contracts/Errors/UnauthorizedError'
import { UserRepository } from '@/Application/Contracts/Repositories/UserRepository'
import {
  SignIn,
  SignInParams,
  SignInResponse
} from '@/Domain/Authentication/UseCases/SignIn'
import { LoggedInUser } from '@/Domain/Users/Models/User'
import { logger } from '@/Infrastructure/Logger/PinoLoggerAdapter'

export class SignInUseCase implements SignIn {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasherComparer: HashComparer,
    private readonly encryper: Encrypter
  ) {}

  async signIn(params: SignInParams): Promise<SignInResponse> {
    logger.info('Sign in process started with: ', params)

    logger.info(`Check if user exists with email ${params.email}`)
    const user = await this.userRepository.getUserByEmail(params.email)

    if (!user) {
      logger.warn(`User was not found with ${params.email}`)
      throw new NotFoundError('User not found')
    }

    logger.info(`Comparing passwords process started`)

    const { password, ...rest } = user
    const isPasswordEqual = await this.hasherComparer.compare(
      params.password,
      password
    )
    logger.warn(`Comparing passwords process finished`)

    if (!isPasswordEqual) {
      logger.warn(`Password is wrong, sign in process finished`)
      throw new UnauthorizedError('Email or password invalid')
    }

    logger.warn(`JWT process started`)
    const jwt = await this.encryper.encrypt<LoggedInUser>(rest)
    logger.warn(`JWT process finished`)
    return {
      jwt
    }
  }
}
