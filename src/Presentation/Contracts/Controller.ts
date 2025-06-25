import { Cookies, Headers, HttpRequest, HttpResponse, Params } from './Http'

export interface Controller {
  handle(
    request: HttpRequest,
    cookies: Cookies,
    headers: Headers,
    params: Params
  ): Promise<HttpResponse>
}
