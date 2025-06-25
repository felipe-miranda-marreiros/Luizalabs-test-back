import { CurrentUserReponse } from '@/Domain/Users/UseCases/CurrentUser'
import { Tspec } from 'tspec'

export type UserApiSpec = Tspec.DefineApiSpec<{
  security: 'cookieAuth'
  basePath: '/api/users'
  tags: ['Users']
  paths: {
    '/current-user': {
      get: {
        summary: 'Get logged in user'
        responses: { 200: CurrentUserReponse }
      }
    }
  }
}>
