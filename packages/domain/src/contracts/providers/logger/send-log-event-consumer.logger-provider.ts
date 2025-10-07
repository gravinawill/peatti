export namespace SendLogEventConsumerLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string
    eventName: string
    consumerName: string
    [key: string]: unknown
  }>
  export type Result = Readonly<null>
}

export interface ISendLogEventConsumerLoggerProvider {
  sendLogEventConsumer(
    parameters: SendLogEventConsumerLoggerProviderDTO.Parameters
  ): SendLogEventConsumerLoggerProviderDTO.Result
}
