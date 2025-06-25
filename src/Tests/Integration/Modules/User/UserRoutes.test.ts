import { app } from '@/Main/Libs/Express/Express'
import request from 'supertest'

describe('User Routes', () => {
  describe('POST', () => {
    it('Should return 200 if payload is correct', async () => {
      await request(app)
        .post('/api/auth/sign-up')
        .send({
          email: 'testing_email@gmail.com',
          first_name: 'any_first_name',
          last_name: 'any_last_name',
          password: 'any_password',
          username: 'any_username484777'
        })
        .set('Accept', 'application/json')
        .expect(200)
    })

    it('Should return 200 and a cookie on sign up', async () => {
      const response = await request(app)
        .post('/api/auth/sign-up')
        .send({
          email: 'cookie_email@gmail.com',
          password: 'cookie_password',
          username: 'any_username4847778',
          last_name: 'any_last_name',
          first_name: 'any_first_name'
        })
        .expect(200)

      const cookies = response.headers['set-cookie'] as unknown as string[]
      const cookie = cookies.find((cookie) => cookie.startsWith('jwt'))
      const accessToken = cookie?.split(';')[0].split('=')[1]
      expect(accessToken).toBeDefined()
    })
  })
})
