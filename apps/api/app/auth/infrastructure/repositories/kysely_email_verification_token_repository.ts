import { IEmailVerificationTokenRepository } from '../../domain/repositories/i_email_verification_token_repository.js'
import { EmailVerificationToken } from '../../domain/entities/email_verification_token.entity.js'
import { db } from '#services/db'

export class KyselyEmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
  async create(token: EmailVerificationToken): Promise<EmailVerificationToken> {
    await db
      .insertInto('email_verification_tokens')
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

  async findByToken(token: string): Promise<EmailVerificationToken | null> {
    const row = await db
      .selectFrom('email_verification_tokens')
      .selectAll()
      .where('token', '=', token)
      .executeTakeFirst()

    if (!row) return null
    return this.toDomain(row)
  }

  async findByUserId(userId: string): Promise<EmailVerificationToken | null> {
    const row = await db
      .selectFrom('email_verification_tokens')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirst()

    if (!row) return null
    return this.toDomain(row)
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db
      .deleteFrom('email_verification_tokens')
      .where('user_id', '=', userId)
      .execute()
  }

  async deleteByToken(token: string): Promise<void> {
    await db
      .deleteFrom('email_verification_tokens')
      .where('token', '=', token)
      .execute()
  }

  private toDomain(row: any): EmailVerificationToken {
    return EmailVerificationToken.create({
      id: row.id,
      userId: row.user_id,
      token: row.token,
      expiresAt: new Date(row.expires_at),
      createdAt: new Date(row.created_at),
    })
  }
}
