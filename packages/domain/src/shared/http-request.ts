export type HttpRequest<Body = unknown, Query = unknown, Parameters = unknown, Headers = unknown> = {
  body: Body
  query: Query
  params: Parameters
  headers: Headers
  access_token: string
}
