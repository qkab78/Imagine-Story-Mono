import { IUserRepository } from '#users/domain/repositories/user_repository'
import { User } from '#users/domain/entities/user.entity'
import { UserId } from '#users/domain/value-objects/user_id.vo'
import { Email } from '#users/domain/value-objects/email.vo'
import { db } from '#services/db'

/**
 * Kysely User Repository
 *
 * PostgreSQL implementation using Kysely query builder
 * Provides read-only access to user data for notifications
 */
export class KyselyUserRepository implements IUserRepository {
  async findById(id: UserId | string): Promise<User | null> {
    const idValue = typeof id === 'string' ? id : id.getValue()

    const userRow = await db
      .selectFrom('users')
      .where('id', '=', idValue)
      .select(['id', 'email', 'firstname', 'lastname'])
      .executeTakeFirst()

    if (!userRow) {
      return null
    }

    return User.create(
      UserId.create(userRow.id),
      Email.create(userRow.email),
      userRow.firstname,
      userRow.lastname
    )
  }
}
