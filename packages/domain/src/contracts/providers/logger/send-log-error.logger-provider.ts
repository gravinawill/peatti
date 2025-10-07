export namespace SendLogErrorLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string
    error: unknown
  }>
  export type Result = Readonly<null>
}

export interface ISendLogErrorLoggerProvider {
  sendLogError(parameters: SendLogErrorLoggerProviderDTO.Parameters): SendLogErrorLoggerProviderDTO.Result
}
