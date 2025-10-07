export namespace SendLogInfoLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string
    [key: string]: unknown
  }>
  export type Result = Readonly<null>
}

export interface ISendLogInfoLoggerProvider {
  sendLogInfo(parameters: SendLogInfoLoggerProviderDTO.Parameters): SendLogInfoLoggerProviderDTO.Result
}
