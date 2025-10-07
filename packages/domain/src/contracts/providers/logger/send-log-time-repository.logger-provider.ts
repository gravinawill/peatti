export namespace SendLogTimeRepositoryLoggerProviderDTO {
  export type Parameters = Readonly<{
    runtimeInMs: number
    repositoryName: string
    method: string
    isSuccess: boolean
  }>
  export type Result = Readonly<null>
}

export interface ISendLogTimeRepositoryLoggerProvider {
  sendLogTimeRepository(
    parameters: SendLogTimeRepositoryLoggerProviderDTO.Parameters
  ): SendLogTimeRepositoryLoggerProviderDTO.Result
}
