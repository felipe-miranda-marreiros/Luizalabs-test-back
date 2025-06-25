export interface SignInResponse {
  jwt: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface SignIn {
  signIn(params: SignInParams): Promise<SignInResponse>
}
