import { SignUpParams } from '@/Domain/Authentication/UseCases/SignUp'
import { app } from '@/Main/Libs/Express/Express'
import request from 'supertest'

describe('SignIn Routes', () => {
  it('Should return 200 on signing in', async () => {
    const createUserMock: SignUpParams = {
      email: 'any_emaildds@gmail.com',
      first_name: 'any_first_name',
      last_name: 'any_last_name',
      password: 'any_password',
      username: 'any_usernamesds'
    }
    await request(app)
      .post('/api/auth/sign-up')
      .send(createUserMock)
      .set('Accept', 'application/json')
      .expect(200)
    const response = await request(app)
      .post('/api/auth/sign-in')
      .send({
        email: createUserMock.email,
        password: createUserMock.password
      })
      .set('Accept', 'application/json')
      .expect(200)
    const cookies = response.headers['set-cookie'] as unknown as string[]
    const cookie = cookies.find((cookie) => cookie.startsWith('jwt'))
    const accessToken = cookie?.split(';')[0].split('=')[1]
    expect(accessToken).toBeDefined()
  })
  it('Should return 400 if email is not valid', async () => {
    await request(app)
      .post('/api/auth/sign-in')
      .send({
        email: 'invalidmail.com',
        password: 'valid_password'
      })
      .set('Accept', 'application/json')
      .expect(400)
  })
})

it('Should return 400 if password is not valid', async () => {
  await request(app)
    .post('/api/auth/sign-in')
    .send({
      email: 'valid@gmail.com',
      password: ''
    })
    .set('Accept', 'application/json')
    .expect(400)
})
