import { Router, static as static_ } from 'express'
import path from 'path'

export const swaggerRouter = Router()

swaggerRouter.use('/docs', static_(path.join(__dirname)))
swaggerRouter.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'SwaggerTemplate.html'))
})
