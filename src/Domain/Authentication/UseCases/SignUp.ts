export type SignUpParams = {
  first_name: string
  last_name: string
  password: string
  email: string
}

export type SignUpResponse = {
  token: string
}

export interface SignUp {
  signUp(params: SignUpParams): Promise<SignUpResponse>
}
