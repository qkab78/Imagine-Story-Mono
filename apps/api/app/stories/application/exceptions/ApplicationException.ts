/**
 * Application Exception
 *
 * Base exception for all application-level errors.
 * Application exceptions represent errors in use case execution,
 * such as resource not found, permission denied, etc.
 */
export class ApplicationException extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(message: string, code: string = 'APPLICATION_ERROR', statusCode: number = 500) {
    super(message)
    this.name = 'ApplicationException'
    this.code = code
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
