import { PasswordResetToken } from '../entities/password_reset_token.entity.js'

export abstract class IPasswordResetTokenRepository {
  abstract create(token: PasswordResetToken): Promise<PasswordResetToken>
  abstract findByToken(token: string): Promise<PasswordResetToken | null>
  abstract deleteByUserId(userId: string): Promise<void>
  abstract deleteByToken(token: string): Promise<void>
}
