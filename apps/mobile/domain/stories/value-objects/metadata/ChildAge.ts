import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

/**
 * Child age value object
 *
 * Represents the age of the child for whom the story is created.
 * Valid range: 3-10 years old
 */
export class ChildAge extends ValueObject<number> {
  protected readonly value: number

  private static readonly MIN_AGE = 3
  private static readonly MAX_AGE = 10

  private constructor(age: number) {
    super()
    this.validate(age)
    this.value = age
  }

  /**
   * Create a ChildAge from a number
   * @param age Child's age (3-10)
   * @returns ChildAge instance
   */
  public static create(age: number): ChildAge {
    return new ChildAge(age)
  }

  /**
   * Check if the age is suitable for younger children (3-5)
   */
  public isYoungerChild(): boolean {
    return this.value >= 3 && this.value <= 5
  }

  /**
   * Check if the age is suitable for older children (6-10)
   */
  public isOlderChild(): boolean {
    return this.value >= 6 && this.value <= 10
  }

  private validate(age: number): void {
    if (!Number.isInteger(age)) {
      throw new InvalidValueObjectException('Age must be an integer')
    }

    if (age < ChildAge.MIN_AGE) {
      throw new InvalidValueObjectException(
        `Age must be at least ${ChildAge.MIN_AGE} years old`
      )
    }

    if (age > ChildAge.MAX_AGE) {
      throw new InvalidValueObjectException(
        `Age cannot exceed ${ChildAge.MAX_AGE} years old`
      )
    }
  }
}
