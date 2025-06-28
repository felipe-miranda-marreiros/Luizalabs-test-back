import { CurrentUserUseCase } from '@/Application/Modules/Users/UseCases/CurrentUserUseCase'
import { createUserRepositoryMock } from '@/Tests/Mocks/Domain/User/UseCases'
import { UserContext } from '@/Application/Contracts/Context/UserContext'
import { CurrentUser } from '@/Domain/Users/UseCases/CurrentUser'

interface Sut {
  sut: CurrentUser
  userContextStub: UserContext
}

function createSut(): Sut {
  const userContextStub: UserContext = {
    getLoggedInUser: () => createUserRepositoryMock,
    setLoggedInUser: () => {}
  }

  const sut = new CurrentUserUseCase(userContextStub)

  return {
    sut,
    userContextStub
  }
}

describe('CurrentUser UseCase', () => {
  it('Should return a User if it is logged in', async () => {
    const { sut } = createSut()
    const user = await sut.getUser()
    expect(user).toEqual(createUserRepositoryMock)
  })
})
