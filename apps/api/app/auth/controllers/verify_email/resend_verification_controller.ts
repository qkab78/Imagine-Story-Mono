import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { IEmailVerificationTokenRepository } from '../../domain/repositories/i_email_verification_token_repository.js'
import { IAuthUserRepository } from '../../domain/repositories/i_auth_user_repository.js'
import { EmailVerificationToken } from '../../domain/entities/email_verification_token.entity.js'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { IDateService } from '#stories/domain/services/i_date_service'
import queue from '@rlanz/bull-queue/services/main'
import SendUserRegisterConfirmationEmailJob from '#jobs/send_user_register_confirmation_email_job'
import { randomBytes } from 'crypto'

@inject()
export default class ResendVerificationController {
  constructor(
    private readonly tokenRepository: IEmailVerificationTokenRepository,
    private readonly userRepository: IAuthUserRepository,
    private readonly randomService: IRandomService,
    private readonly dateService: IDateService
  ) {}

  /**
   * Resend verification email
   * POST /auth/resend-verification
   * Requires authentication
   */
  public async resend({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    // Check if already verified
    if (user.email_verified_at) {
      return response.badRequest({ error: 'Email is already verified' })
    }

    // Delete any existing tokens for this user
    await this.tokenRepository.deleteByUserId(user.id)

    // Generate new token
    const token = randomBytes(32).toString('hex')
    const now = new Date(this.dateService.now())
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    const verificationToken = EmailVerificationToken.create({
      id: this.randomService.generateRandomUuid(),
      userId: user.id,
      token,
      expiresAt,
      createdAt: now,
    })

    await this.tokenRepository.create(verificationToken)

    // Send verification email
    queue.dispatch(SendUserRegisterConfirmationEmailJob, {
      email: user.email,
      firstname: user.firstname,
      token,
    })

    return response.ok({
      message: 'Verification email sent successfully',
    })
  }
}
