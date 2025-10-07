export namespace SendLogTimeControllerLoggerProviderDTO {
  export type Parameters = Readonly<{
    runtimeInMs: number
    controllerName: string
    isSuccess: boolean
  }>
  export type Result = Readonly<null>
}

export interface ISendLogTimeControllerLoggerProvider {
  sendLogTimeController(
    parameters: SendLogTimeControllerLoggerProviderDTO.Parameters
  ): SendLogTimeControllerLoggerProviderDTO.Result
}
