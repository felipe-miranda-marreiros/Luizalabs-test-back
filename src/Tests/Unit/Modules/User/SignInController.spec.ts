import { Encrypter } from '@/Application/Contracts/Criptography/Encrypter'
import { HashComparer } from '@/Application/Contracts/Criptography/HashComparer'
import { NotFoundError } from '@/Application/Contracts/Errors/NotFoundError'
import { UnauthorizedError } from '@/Application/Contracts/Errors/UnauthorizedError'
import { UserRepository } from '@/Application/Contracts/Repositories/UserRepository'
import { SignInUseCase } from '@/Application/Modules/Authentication/UseCases/SignInUseCase'
import { SignIn } from '@/Domain/Authentication/UseCases/SignIn'
import { createEncrypterStub } from '@/Tests/Mocks/Criptography/EncrypterMock'
import { createHasherStub } from '@/Tests/Mocks/Criptography/HasherMock'
import { signInParamsMock } from '@/Tests/Mocks/Domain/SignIn/SignInMock'
import { createUserRepositoryMock } from '@/Tests/Mocks/Domain/User/UseCases'
import { createUserRepositoryStub } from '@/Tests/Mocks/Repositories/UserRepositoryMock'

interface Sut {
  sut: SignIn
  userRepositoryStub: UserRepository
  hasherStub: HashComparer
  encrypterStub: Encrypter
}

function createSut(): Sut {
  const userRepositoryStub = createUserRepositoryStub(createUserRepositoryMock)
  const hasherStub = createHasherStub()
  const encrypterStub = createEncrypterStub()
  const sut = new SignInUseCase(userRepositoryStub, hasherStub, encrypterStub)
  return {
    sut,
    userRepositoryStub,
    encrypterStub,
    hasherStub
  }
}

describe('SignIn Controller', () => {
  it('Should return NotFoundError if getUserByEmail returns undefined', async () => {
    const { sut, userRepositoryStub } = createSut()
    jest
      .spyOn(userRepositoryStub, 'getUserByEmail')
      .mockResolvedValueOnce(undefined)
    const promise = sut.signIn(signInParamsMock)
    await expect(promise).rejects.toThrow(NotFoundError)
  })
  it('Should call getUserByEmail with correct values', async () => {
    const { sut, userRepositoryStub } = createSut()
    const getUserByEmailSpy = jest.spyOn(userRepositoryStub, 'getUserByEmail')
    await sut.signIn(signInParamsMock)
    expect(getUserByEmailSpy).toHaveBeenCalledWith(signInParamsMock.email)
  })
  it('Should return UnauthorizedError if HashComparer returns false', async () => {
    const { sut, hasherStub } = createSut()
    jest.spyOn(hasherStub, 'compare').mockResolvedValueOnce(false)
    const promise = sut.signIn(signInParamsMock)
    await expect(promise).rejects.toThrow(UnauthorizedError)
  })
  it('Should call HashComparer with correct values', async () => {
    const { sut, hasherStub } = createSut()
    const compareSpy = jest.spyOn(hasherStub, 'compare')
    await sut.signIn(signInParamsMock)
    expect(compareSpy).toHaveBeenCalledWith(
      signInParamsMock.password,
      'any_password'
    )
  })
  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = createSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.signIn(signInParamsMock)
    await expect(promise).rejects.toThrow()
  })
  it('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = createSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.signIn(signInParamsMock)
    expect(encryptSpy).toHaveBeenCalledWith({
      created_at: 'any_date',
      email_id: 1,
      first_name: 'any_first_name',
      id: 1,
      last_name: 'any_last_name',
      updated_at: 'any_date',
      username_id: 1
    })
  })
  it('Should return a jwt if params are valid', async () => {
    const { sut } = createSut()
    const response = await sut.signIn(signInParamsMock)
    expect(response).toEqual({ jwt: 'encrypted_value' })
  })
})
