import { UserRepository } from '@/Application/Contracts/Repositories/UserRepository'
import { SignUpParams } from '@/Domain/Authentication/UseCases/SignUp'
import { LoggedInUser, User } from '@/Domain/Users/Models/User'

export function createUserRepositoryStub(
  response: LoggedInUser
): UserRepository {
  class UserRepositoryStub implements UserRepository {
    getUserByEmail(email: string): Promise<User | undefined> {
      return Promise.resolve({
        created_at: 'any_date',
        email_id: 1,
        first_name: 'any_first_name',
        id: 1,
        last_name: 'any_last_name',
        password: 'any_password',
        updated_at: 'any_date',
        username_id: 1
      })
    }
    isEmailInUse(email: string): Promise<boolean> {
      return Promise.resolve(false)
    }
    isUsernameInUse(username: string): Promise<boolean> {
      return Promise.resolve(false)
    }
    createUser(params: SignUpParams): Promise<LoggedInUser> {
      return Promise.resolve(response)
    }
  }
  return new UserRepositoryStub()
}
