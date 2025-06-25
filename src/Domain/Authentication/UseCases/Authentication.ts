import { LoggedInUser } from '@/Domain/Users/Models/User'

export interface AuthenticationParams {
  jwt: string
}

export type AuthenticationResponse = {
  current_user: LoggedInUser
}

export interface Authentication {
  auth(params: AuthenticationParams): Promise<AuthenticationResponse>
}
