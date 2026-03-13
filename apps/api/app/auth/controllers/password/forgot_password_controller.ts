import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { randomBytes } from 'crypto'
import { IAuthUserRepository } from '../../domain/repositories/i_auth_user_repository.js'
import { IPasswordResetTokenRepository } from '../../domain/repositories/i_password_reset_token_repository.js'
import { PasswordResetToken } from '../../domain/entities/password_reset_token.entity.js'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { IDateService } from '#stories/domain/services/i_date_service'
import queue from '@rlanz/bull-queue/services/main'
import SendPasswordResetEmailJob from '#jobs/send_password_reset_email_job'
import logger from '@adonisjs/core/services/logger'

const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  })
)

@inject()
export default class ForgotPasswordController {
  constructor(
    private readonly authUserRepository: IAuthUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository,
    private readonly randomService: IRandomService,
    private readonly dateService: IDateService
  ) {}

  async handle({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    // Always return 200 to prevent email enumeration
    const user = await this.authUserRepository.findByEmail(email.toLowerCase())

    if (user) {
      // Delete any existing reset tokens for this user
      await this.tokenRepository.deleteByUserId(user.id)

      const token = randomBytes(32).toString('hex')
      const now = new Date(this.dateService.now())
      const expiresAt = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour

      const resetToken = PasswordResetToken.create({
        id: this.randomService.generateRandomUuid(),
        userId: user.id,
        token,
        expiresAt,
        createdAt: now,
      })

      await this.tokenRepository.create(resetToken)

      queue.dispatch(SendPasswordResetEmailJob, {
        email: user.email,
        firstname: user.firstname,
        token,
      })

      logger.info(`Password reset email dispatched for user ${user.id}`)
    }

    return response.ok({
      message: 'If an account with this email exists, a password reset link has been sent.',
    })
  }
}
