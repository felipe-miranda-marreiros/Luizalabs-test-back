import { Router } from 'express'
import { signInController } from './Routes/SignInRoute'
import { signUpController } from './Routes/SignUpRoute'

export const authenticationRouter = Router()

authenticationRouter.post('/api/auth/sign-in', async (req, res) => {
  const response = await signInController.handle({ body: req.body })
  res.cookie('jwt', response.body?.jwt)
  res.status(response.status_code).json(response.body)
})

authenticationRouter.post('/api/auth/sign-up', async (req, res) => {
  const response = await signUpController.handle({ body: req.body })
  res.cookie('jwt', response.body?.access_token)
  res.status(response.status_code).json(response.body)
})
