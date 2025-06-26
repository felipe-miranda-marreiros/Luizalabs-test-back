import { Router } from 'express'
import { signInController } from './Routes/SignInRoute'
import { signUpController } from './Routes/SignUpRoute'

export const authenticationRouter = Router()

authenticationRouter.post('/api/auth/sign-in', async (req, res) => {
  const response = await signInController.handle({ body: req.body })
  res.cookie('token', response.body?.token, {
    secure: false,
    sameSite: false
  })
  res.status(response.status_code).json(response.body)
})

authenticationRouter.post('/api/auth/sign-up', async (req, res) => {
  const response = await signUpController.handle({ body: req.body })
  res.cookie('token', response.body?.token, {
    secure: false,
    sameSite: false
  })
  res.status(response.status_code).json(response.body)
})

authenticationRouter.post('/api/auth/logout', async (req, res) => {
  res.clearCookie('token')
  res.status(200).json()
})
