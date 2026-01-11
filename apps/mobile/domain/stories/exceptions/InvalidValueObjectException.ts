import { DomainException } from './DomainException'

/**
 * Exception thrown when a value object receives invalid data
 */
export class InvalidValueObjectException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_VALUE_OBJECT')
    this.name = 'InvalidValueObjectException'
    Object.setPrototypeOf(this, InvalidValueObjectException.prototype)
  }
}
