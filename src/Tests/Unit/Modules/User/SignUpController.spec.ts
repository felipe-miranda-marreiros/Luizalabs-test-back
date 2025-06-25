import {
  SignUp,
  SignUpParams,
  SignUpResponse
} from '@/Domain/Authentication/UseCases/SignUp'
import { Validation } from '@/Presentation/Contracts/Validation'
import { SignUpController } from '@/Presentation/Controllers/SignUpController/SignUpController'
import {
  signUpParamsMock,
  signUpResponseMock
} from '@/Tests/Mocks/Domain/User/UseCases'

interface Sut {
  validationStub: Validation
  createUserUseCaseStub: SignUp
  sut: SignUpController
}

function makeCreateUserUseCase(): SignUp {
  class CreateUserUseCaseStub implements SignUp {
    signUp(params: SignUpParams): Promise<SignUpResponse> {
      return Promise.resolve(signUpResponseMock)
    }
  }
  return new CreateUserUseCaseStub()
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate<TData>(data: TData): TData {
      return data
    }
  }
  return new ValidationStub()
}

function createSut(): Sut {
  const validationStub = makeValidation()
  const createUserUseCaseStub = makeCreateUserUseCase()
  const sut = new SignUpController(createUserUseCaseStub, validationStub)
  return {
    createUserUseCaseStub,
    validationStub,
    sut
  }
}

describe('CreateUser Controller', () => {
  it('Should return 200 if User is created successfully', async () => {
    const { sut } = createSut()
    const response = await sut.handle({ body: signUpParamsMock })
    expect(response.body?.access_token).toEqual(signUpResponseMock.access_token)
    expect(response.status_code).toBe(200)
  })
})
