import { Router, static as static_ } from 'express'
import path from 'path'

export const swaggerRouter = Router()

swaggerRouter.use(
  '/docs',
  static_(path.join(path.resolve(), 'src/Main/Routes/Swagger'))
)
swaggerRouter.get('/docs', (req, res) => {
  res.sendFile(
    path.join(path.resolve(), 'src/Main/Routes/Swagger', 'SwaggerTemplate.html')
  )
})
