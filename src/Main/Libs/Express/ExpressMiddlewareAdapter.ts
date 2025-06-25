import { Cookies, Headers, HttpRequest } from '@/Presentation/Contracts/Http'
import { Middleware } from '@/Presentation/Contracts/Middleware'
import { NextFunction, Request, Response } from 'express'

export function expressMiddlewareAdapter(middleware: Middleware) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const cookies: Cookies = {
      data: req.cookies
    }
    const headers: Headers = {
      data: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest, cookies, headers)
    if (httpResponse.status_code >= 200 && httpResponse.status_code <= 299) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.status_code).json(httpResponse.body)
    }
  }
}
