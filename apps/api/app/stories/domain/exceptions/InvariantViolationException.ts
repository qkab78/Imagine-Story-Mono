import { DomainException } from './DomainException.js'

/**
 * Invariant Violation Exception
 *
 * Thrown when an entity's business rule or invariant is violated.
 * Examples: publishing a story without chapters, adding too many chapters, etc.
 */
export class InvariantViolationException extends DomainException {
  constructor(message: string) {
    super(message, 'INVARIANT_VIOLATION')
    this.name = 'InvariantViolationException'
  }

  /**
   * Create exception for minimum requirement not met
   */
  public static minimumNotMet(entityName: string, field: string, minimum: number, actual: number): InvariantViolationException {
    return new InvariantViolationException(
      `${entityName} must have at least ${minimum} ${field}, but has ${actual}`
    )
  }

  /**
   * Create exception for maximum exceeded
   */
  public static maximumExceeded(entityName: string, field: string, maximum: number, actual: number): InvariantViolationException {
    return new InvariantViolationException(
      `${entityName} cannot have more than ${maximum} ${field}, but has ${actual}`
    )
  }

  /**
   * Create exception for required field
   */
  public static requiredField(entityName: string, field: string): InvariantViolationException {
    return new InvariantViolationException(
      `${entityName} requires ${field}`
    )
  }

  /**
   * Create exception for invalid state transition
   */
  public static invalidStateTransition(entityName: string, fromState: string, toState: string, reason: string): InvariantViolationException {
    return new InvariantViolationException(
      `Cannot transition ${entityName} from ${fromState} to ${toState}: ${reason}`
    )
  }
}
