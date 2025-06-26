import express from 'express'
import { errorHandlerMiddleware } from './ErrorHandlerMiddleware'
import cookieParser from 'cookie-parser'
import { authenticationMiddleware } from '@/Main/Routes/Users/Routes/CurrentUserRoute'
import { expressRequestContextMiddleware } from './ExpressRequestContextMiddleware'
import { expressMiddlewareAdapter } from './ExpressMiddlewareAdapter'
import { expressAuthenticationMiddleware } from './AuthMiddleware'
import { authenticationRouter } from '@/Main/Routes/Authentication'
import { userRouter } from '@/Main/Routes/Users'
import { swaggerRouter } from '@/Main/Routes/Swagger/SwggerRouter'
import { wishRouter } from '@/Main/Routes/Wish'
import axios from 'axios'
import cors from 'cors'

export const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
app.use(expressRequestContextMiddleware)
app.use(cookieParser())
app.use(express.json())

// Public Routes
app.use(swaggerRouter)
app.use(authenticationRouter)
app.get('/api/products', async (req, res) => {
  const response = await axios.get('https://fakestoreapi.com/products')
  res.status(200).json(response.data)
})

// Protected Routes
app.use(expressMiddlewareAdapter(authenticationMiddleware))
app.use(expressAuthenticationMiddleware)
app.use(userRouter)
app.use(wishRouter)

// Global Error Handler
app.use(errorHandlerMiddleware)
