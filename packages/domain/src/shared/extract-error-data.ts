export function extractErrorData(parameters: { error: unknown }): string {
  const { error } = parameters
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === 'string') return message
  }
  if (error && typeof error === 'object' && 'errorMessage' in error) {
    const message = (error as { errorMessage: unknown }).errorMessage
    if (typeof message === 'string') return message
  }
  return 'An unexpected error occurred'
}
