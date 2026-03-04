import { UserId } from '../value-objects/user_id.vo.js'
import { Email } from '../value-objects/email.vo.js'

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
    public readonly lastname: string,
    public readonly pushToken: string | null = null
  ) {}

  public static create(
    id: UserId,
    email: Email,
    firstname: string,
    lastname: string,
    pushToken: string | null = null
  ): User {
    return new User(id, email, firstname, lastname, pushToken)
  }

  /**
   * Returns the full name of the user
   */
  public getFullName(): string {
    return `${this.firstname} ${this.lastname}`
  }
}
