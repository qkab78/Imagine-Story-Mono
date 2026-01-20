import { UserId } from '../value-objects/UserId.vo.js'
import { Email } from '../value-objects/Email.vo.js'

/**
 * User Entity
 *
 * Lightweight entity for email notification purposes.
 * Full user management is in a separate bounded context.
 *
 * This entity only contains the minimal data needed for sending emails.
 */
export class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly firstname: string,
    public readonly lastname: string
  ) {}

  public static create(id: UserId, email: Email, firstname: string, lastname: string): User {
    return new User(id, email, firstname, lastname)
  }

  /**
   * Returns the full name of the user
   */
  public getFullName(): string {
    return `${this.firstname} ${this.lastname}`
  }
}
