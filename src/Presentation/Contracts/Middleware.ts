import { Cookies, Headers, HttpRequest, HttpResponse } from './Http'

export interface Middleware {
  handle(
    request: HttpRequest,
    cookies: Cookies,
    headers: Headers
  ): Promise<HttpResponse>
}
