import { Controller } from '@/Presentation/Contracts/Controller'
import {
  Cookies,
  Headers,
  HttpRequest,
  Params
} from '@/Presentation/Contracts/Http'
import { Request, Response } from 'express'

export function expressControllerAdapter(controller: Controller) {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const cookies: Cookies = {
      data: req.cookies
    }
    const headers: Headers = {
      data: req.headers
    }
    const params: Params = {
      data: req.params
    }
    const httpResponse = await controller.handle(
      httpRequest,
      cookies,
      headers,
      params
    )
    res.status(httpResponse.status_code).json(httpResponse.body)
  }
}
