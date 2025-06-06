export const getErrorMessage = <T>(error: T, defaultMessage = 'Unhandled unexpected error') =>
  (error instanceof Error ? error.message : error) ?? defaultMessage;
