import { IPasswordResetTokenRepository } from '../../domain/repositories/i_password_reset_token_repository.js'
import { PasswordResetToken } from '../../domain/entities/password_reset_token.entity.js'
import { db } from '#services/db'

export class KyselyPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  async create(token: PasswordResetToken): Promise<PasswordResetToken> {
    await db
      .insertInto('password_reset_tokens')
      .values({
        id: token.id,
        user_id: token.userId,
        token: token.token,
        expires_at: token.expiresAt.toISOString(),
        created_at: token.createdAt.toISOString(),
      })
      .execute()

    return token
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const row = await db
      .selectFrom('password_reset_tokens')
      .selectAll()
      .where('token', '=', token)
      .executeTakeFirst()

    if (!row) return null
    return this.toDomain(row)
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db
      .deleteFrom('password_reset_tokens')
      .where('user_id', '=', userId)
      .execute()
  }

  async deleteByToken(token: string): Promise<void> {
    await db
      .deleteFrom('password_reset_tokens')
      .where('token', '=', token)
      .execute()
  }

  private toDomain(row: any): PasswordResetToken {
    return PasswordResetToken.create({
      id: row.id,
      userId: row.user_id,
      token: row.token,
      expiresAt: new Date(row.expires_at),
      createdAt: new Date(row.created_at),
    })
  }
}
