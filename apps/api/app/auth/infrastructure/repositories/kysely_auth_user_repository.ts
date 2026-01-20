import { IAuthUserRepository } from '../../domain/repositories/i_auth_user_repository.js'
import { AuthUser } from '../../domain/entities/auth_user.entity.js'
import { db } from '#services/db'

export class KyselyAuthUserRepository implements IAuthUserRepository {
  async findById(id: string): Promise<AuthUser | null> {
    const row = await db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst()

    if (!row) return null
    return this.toDomain(row)
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const row = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email.toLowerCase())
      .executeTakeFirst()

    if (!row) return null
    return this.toDomain(row)
  }

  async create(user: AuthUser): Promise<AuthUser> {
    await db
      .insertInto('users')
      .values({
        id: user.id,
        email: user.email,
        password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
      })
      .execute()

    return user
  }

  private toDomain(row: any): AuthUser {
    return AuthUser.create({
      id: row.id,
      email: row.email,
      password: row.password,
      firstname: row.firstname,
      lastname: row.lastname,
      role: row.role,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })
  }
}
