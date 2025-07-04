import { SignUpParams } from '@/Domain/Authentication/UseCases/SignUp'
import { db } from '@/Infrastructure/Database/Drizzle/DrizzleClient'
import { UserSQLRepository } from '@/Infrastructure/Database/Repositories/UserSQLRepository'
import { emails_table } from '@/Infrastructure/Database/Schemas/Schemas'

describe('User Repository', () => {
  let userSQLRepository = null as unknown as UserSQLRepository

  beforeAll(() => {
    userSQLRepository = new UserSQLRepository()
  })

  it('Should insert an User into database and return its model', async () => {
    const createUserMock: SignUpParams = {
      email: 'any_email@gmail.com',
      first_name: 'any_first_name',
      last_name: 'any_last_name',
      password: 'any_password'
    }
    const user = await userSQLRepository.createUser(createUserMock)
    expect(user.first_name).toEqual(createUserMock.first_name)
    expect(user.last_name).toEqual(createUserMock.last_name)
    expect(user).not.toHaveProperty('password')
  })
  it('Should return false if isEmailInUse does not find an email equals to params', async () => {
    const isEmailInUse = await userSQLRepository.isEmailInUse(
      'avaiable_email@gmail.com'
    )
    expect(isEmailInUse).toEqual(false)
  })
  it('Should return true if isEmailInUse does find an email equals to params', async () => {
    const usedEmail = await db
      .insert(emails_table)
      .values({ email: 'used_email@gmail.com' })
      .returning({ usedEmail: emails_table.email })
    const isEmailInUse = await userSQLRepository.isEmailInUse(
      usedEmail[0].usedEmail
    )
    expect(isEmailInUse).toEqual(true)
  })
  it('Should return an User if getUserByEmail does find based on email', async () => {
    const createUserMock: SignUpParams = {
      email: 'test1@gmail.com',
      first_name: 'any_first_name',
      last_name: 'any_last_name',
      password: 'any_password'
    }
    await userSQLRepository.createUser(createUserMock)
    const user = await userSQLRepository.getUserByEmail(createUserMock.email)
    expect(user).toBeDefined()
  })
})
