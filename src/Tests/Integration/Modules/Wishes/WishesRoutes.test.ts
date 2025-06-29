import { getCookies } from '../../Helpers/GetCookies'
import { app } from '@/Main/Libs/Express/Express'
import request from 'supertest'

describe('Wish Routes', () => {
  describe('POST', () => {
    let cookies: string[] = []

    beforeAll(async () => {
      cookies = await getCookies()
    })
    it('Should add a product to wish list or create one if it does not exists', async () => {
      const response = await request(app)
        .post(`/api/wish/product/1`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)
      expect(response.body).toEqual({ items: [1], count: 1 })
    })
    it('Should remove a product to wish list or create one if it does not exists', async () => {
      const response = await request(app)
        .post(`/api/wish/product/1`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)
      expect(response.body).toEqual({ items: [], count: 0 })
    })
  })
  describe('GET', () => {
    let cookies: string[] = []

    beforeAll(async () => {
      cookies = await getCookies()
    })
    it('Should return a wish list if it is already created', async () => {
      await request(app)
        .post(`/api/wish/product/1`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)
      const response = await request(app)
        .get(`/api/wish/current`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)
      expect(response.body).toEqual({ items: [1], count: 1 })
    })
  })
  describe('GET', () => {
    let cookies: string[] = []

    beforeAll(async () => {
      cookies = await getCookies()
    })
    it('Should return a wish list with products', async () => {
      await request(app)
        .post(`/api/wish/product/1`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)
      const response = await request(app)
        .get(`/api/wish/products`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)
      expect(response.body).toHaveLength(1)
    })
  })
  describe('DELETE', () => {
    let cookies: string[] = []

    beforeAll(async () => {
      cookies = await getCookies()
    })

    it('Should return 404 if wish does not exist', async () => {
      await request(app)
        .delete(`/api/wish`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(404)
    })
    it('Should return 200 if wish does exist', async () => {
      await request(app)
        .post(`/api/wish/product/1`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)

      await request(app)
        .get(`/api/wish/current`)
        .set('Cookie', cookies)
        .set('Accept', 'application/json')
        .expect(200)
    })
  })
})
