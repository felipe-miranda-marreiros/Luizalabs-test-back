import {
  SignInParams,
  SignInResponse
} from '@/Domain/Authentication/UseCases/SignIn'
import {
  SignUpParams,
  SignUpResponse
} from '@/Domain/Authentication/UseCases/SignUp'
import { Tspec } from 'tspec'

export type AuthenticationApiSpec = Tspec.DefineApiSpec<{
  basePath: '/api/auth'
  tags: ['Authentication']
  paths: {
    '/sign-in': {
      post: {
        summary: 'Sign in with email and password'
        body: SignInParams
        responses: { 200: SignInResponse }
      }
    }
    '/sign-up': {
      post: {
        summary: 'Sign up and create a blog account'
        body: SignUpParams
        responses: { 201: SignUpResponse }
      }
    }
  }
}>
