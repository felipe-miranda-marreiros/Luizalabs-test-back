export interface HttpRequest<TRequest = unknown> {
  body: TRequest
}

export interface HttpResponse<TResponse = unknown> {
  status_code: number
  body?: TResponse
}

export interface Cookies<TCookies = unknown> {
  data: TCookies
}

export interface Headers<THeaders = unknown> {
  data: THeaders
}

export interface Params<TParams = unknown> {
  data: TParams
}
