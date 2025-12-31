/**
 * Domain Exception
 *
 * Base exception for all domain-level errors.
 * Domain exceptions represent violations of business rules and invariants.
 */
export class DomainException extends Error {
  public readonly code: string

  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message)
    this.name = 'DomainException'
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}
