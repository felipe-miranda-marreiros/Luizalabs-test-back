import {
  SignIn,
  SignInParams,
  SignInResponse
} from '@/Domain/Authentication/UseCases/SignIn'
import { Controller } from '@/Presentation/Contracts/Controller'
import { HttpRequest, HttpResponse } from '@/Presentation/Contracts/Http'
import { Validation } from '@/Presentation/Contracts/Validation'

export class SignInController implements Controller {
  constructor(
    private readonly signInUseCause: SignIn,
    private readonly validation: Validation
  ) {}

  async handle(
    request: HttpRequest<SignInParams>
  ): Promise<HttpResponse<SignInResponse>> {
    const result = this.validation.validate(request.body)
    const jwt = await this.signInUseCause.signIn(result)
    return {
      status_code: 200,
      body: jwt
    }
  }
}
