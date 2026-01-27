import { EmailVerificationToken } from '../entities/email_verification_token.entity.js'

export abstract class IEmailVerificationTokenRepository {
  abstract create(token: EmailVerificationToken): Promise<EmailVerificationToken>
  abstract findByToken(token: string): Promise<EmailVerificationToken | null>
  abstract findByUserId(userId: string): Promise<EmailVerificationToken | null>
  abstract deleteByUserId(userId: string): Promise<void>
  abstract deleteByToken(token: string): Promise<void>
}
