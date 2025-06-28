import { PartialUser } from '@/Domain/Users/Models/User'

export interface AuthenticationParams {
  token: string
}

export type AuthenticationResponse = {
  current_user: PartialUser
}

export interface Authentication {
  auth(params: AuthenticationParams): Promise<AuthenticationResponse>
}
