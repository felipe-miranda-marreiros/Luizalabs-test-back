import { SignUpParams } from '@/Domain/Authentication/UseCases/SignUp'
import { PartialUser, User } from '@/Domain/Users/Models/User'

export interface UserRepository {
  createUser(params: SignUpParams): Promise<PartialUser>
  isEmailInUse(email: string): Promise<boolean>
  getUserByEmail(email: string): Promise<User | undefined>
}
