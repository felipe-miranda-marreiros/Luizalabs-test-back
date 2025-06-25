import { SignUpParams } from '@/Domain/Authentication/UseCases/SignUp'
import { agent } from 'supertest'
import { faker } from '@faker-js/faker'
import { app } from '@/Main/Libs/Express/Express'

export async function getCookies(): Promise<string[]> {
  const credentials: SignUpParams = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    username: faker.internet.username()
  }
  const authResponse = await agent(app)
    .post(`/api/auth/sign-up`)
    .send(credentials)
    .expect(200)
  const cookies = authResponse.get('Set-Cookie') ?? []
  return cookies
}
