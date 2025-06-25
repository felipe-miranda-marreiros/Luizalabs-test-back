import { Encrypter } from '@/Application/Contracts/Criptography/Encrypter'
import { HashComparer } from '@/Application/Contracts/Criptography/HashComparer'
import { Hasher } from '@/Application/Contracts/Criptography/Hasher'
import { ConflictError } from '@/Application/Contracts/Errors/ConflictError'
import { UserRepository } from '@/Application/Contracts/Repositories/UserRepository'
import { SignUpUseCase } from '@/Application/Modules/Authentication/UseCases/SignUpUseCase'
import { createEncrypterStub } from '@/Tests/Mocks/Criptography/EncrypterMock'
import { createHasherStub } from '@/Tests/Mocks/Criptography/HasherMock'
import {
  createUserRepositoryMock,
  signUpParamsMock,
  signUpResponseMock
} from '@/Tests/Mocks/Domain/User/UseCases'
import { createUserRepositoryStub } from '@/Tests/Mocks/Repositories/UserRepositoryMock'

interface Sut {
  sut: SignUpUseCase
  userRepositoryStub: UserRepository
  hasherStub: Hasher & HashComparer
  encrypterStub: Encrypter
}

function createSut(): Sut {
  const userRepositoryStub = createUserRepositoryStub(createUserRepositoryMock)
  const hasherStub = createHasherStub()
  const encrypterStub = createEncrypterStub()
  const sut = new SignUpUseCase(userRepositoryStub, hasherStub, encrypterStub)
  return {
    sut,
    userRepositoryStub,
    encrypterStub,
    hasherStub
  }
}

describe('SignUp UseCase', () => {
  it('Should not create an User if email already in use', async () => {
    const { sut, userRepositoryStub } = createSut()
    jest.spyOn(userRepositoryStub, 'isEmailInUse').mockResolvedValueOnce(true)
    const promise = sut.signUp(signUpParamsMock)
    await expect(promise).rejects.toThrow(ConflictError)
  })
  it('Should not create an User if username already in use', async () => {
    const { sut, userRepositoryStub } = createSut()
    jest
      .spyOn(userRepositoryStub, 'isUsernameInUse')
      .mockResolvedValueOnce(true)
    const promise = sut.signUp(signUpParamsMock)
    await expect(promise).rejects.toThrow(ConflictError)
  })
  it('Should create an User if params are valid', async () => {
    const { sut } = createSut()
    const response = await sut.signUp(signUpParamsMock)
    expect(response).toEqual(signUpResponseMock)
  })
  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = createSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.signUp(signUpParamsMock)
    await expect(promise).rejects.toThrow()
  })
  it('Should call Hasher witch correct values', async () => {
    const { sut, hasherStub } = createSut()
    const hashedPassword = jest.spyOn(hasherStub, 'hash')
    await sut.signUp(signUpParamsMock)
    expect(hashedPassword).toHaveBeenCalledWith(signUpParamsMock.password)
  })
  it('Should call Encryper witch correct values', async () => {
    const { sut, encrypterStub } = createSut()
    const encrypter = jest.spyOn(encrypterStub, 'encrypt')
    await sut.signUp(signUpParamsMock)
    expect(encrypter).toHaveBeenCalledWith(createUserRepositoryMock)
  })
  it('Should throw if Encryper throws', async () => {
    const { sut, encrypterStub } = createSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.signUp(signUpParamsMock)
    await expect(promise).rejects.toThrow()
  })
})
