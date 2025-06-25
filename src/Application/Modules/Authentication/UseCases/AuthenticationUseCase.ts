import { Decrypter } from '@/Application/Contracts/Criptography/Decrypter'
import {
  Authentication,
  AuthenticationParams,
  AuthenticationResponse
} from '@/Domain/Authentication/UseCases/Authentication'
import { LoggedInUser } from '@/Domain/Users/Models/User'

export class AuthenticationUseCase implements Authentication {
  constructor(private readonly decrypter: Decrypter) {}

  async auth(params: AuthenticationParams): Promise<AuthenticationResponse> {
    const current_user = await this.decrypter.decrypt<LoggedInUser>(params.jwt)
    return {
      current_user
    }
  }
}
