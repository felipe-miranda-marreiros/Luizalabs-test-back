import { fileURLToPath } from 'url'
import path from 'path'
import { Router, static as static_ } from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const swaggerRouter = Router()

swaggerRouter.use('/docs', static_(path.join(__dirname)))
swaggerRouter.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'SwaggerTemplate.html'))
})
