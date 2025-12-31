import { DomainException } from './DomainException.js'

/**
 * Exception thrown when a value object receives invalid data
 */
export class InvalidValueObjectException extends DomainException {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidValueObjectException'
    Object.setPrototypeOf(this, InvalidValueObjectException.prototype)
  }
}
