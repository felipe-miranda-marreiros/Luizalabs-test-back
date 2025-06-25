import {
  SignUp,
  SignUpParams,
  SignUpResponse
} from '@/Domain/Authentication/UseCases/SignUp'
import { Controller } from '@/Presentation/Contracts/Controller'
import { HttpRequest, HttpResponse } from '@/Presentation/Contracts/Http'
import { Validation } from '@/Presentation/Contracts/Validation'

export class SignUpController implements Controller {
  constructor(
    private readonly createUserUseCase: SignUp,
    private readonly validation: Validation
  ) {}

  async handle(
    request: HttpRequest<SignUpParams>
  ): Promise<HttpResponse<SignUpResponse>> {
    const result = this.validation.validate(request.body)
    const accessToken = await this.createUserUseCase.signUp(result)
    return {
      status_code: 200,
      body: accessToken
    }
  }
}
