/**
 * Base class for all Value Objects
 *
 * Value Objects are immutable objects defined by their attributes rather than identity.
 * Two value objects are equal if all their attributes are equal.
 */
export abstract class ValueObject<T> {
  protected abstract readonly value: T

  /**
   * Check equality between two value objects
   * @param other The other value object to compare with
   * @returns true if the value objects are equal, false otherwise
   */
  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof this.constructor)) {
      return false
    }

    return this.value === other.value
  }

  /**
   * Get the primitive value of the value object
   * @returns The underlying primitive value
   */
  public getValue(): T {
    return this.value
  }

  /**
   * String representation of the value object
   * @returns String representation
   */
  public toString(): string {
    return String(this.value)
  }
}
