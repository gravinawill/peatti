export namespace SendLogTimeUseCaseLoggerProviderDTO {
  export type Parameters = Readonly<{
    runtimeInMs: number
    useCaseName: string
    isSuccess: boolean
  }>
  export type Result = Readonly<null>
}

export interface ISendLogTimeUseCaseLoggerProvider {
  sendLogTimeUseCase(
    parameters: SendLogTimeUseCaseLoggerProviderDTO.Parameters
  ): SendLogTimeUseCaseLoggerProviderDTO.Result
}
