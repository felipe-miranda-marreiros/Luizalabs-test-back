export type SignUpParams = {
  username: string
  password: string
  first_name: string
  last_name: string
  email: string
}

export type SignUpResponse = {
  access_token: string
}

export interface SignUp {
  signUp(params: SignUpParams): Promise<SignUpResponse>
}
