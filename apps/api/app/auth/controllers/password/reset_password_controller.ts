import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'
import { IAuthUserRepository } from '../../domain/repositories/i_auth_user_repository.js'
import { IPasswordResetTokenRepository } from '../../domain/repositories/i_password_reset_token_repository.js'

const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    password: vine
      .string()
      .trim()
      .minLength(8)
      .regex(/^(?=.*[A-Z])(?=.*\d)/),
  })
)

@inject()
export default class ResetPasswordController {
  constructor(
    private readonly authUserRepository: IAuthUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository
  ) {}

  async handle({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)

    const resetToken = await this.tokenRepository.findByToken(token)

    if (!resetToken) {
      return response.badRequest({ error: { message: 'Invalid or expired reset token.' } })
    }

    if (resetToken.isExpired()) {
      await this.tokenRepository.deleteByToken(token)
      return response.badRequest({ error: { message: 'Reset token has expired.' } })
    }

    const user = await this.authUserRepository.findById(resetToken.userId)

    if (!user) {
      return response.badRequest({ error: { message: 'User not found.' } })
    }

    const hashedPassword = await hash.make(password)
    await this.authUserRepository.updatePassword(user.id, hashedPassword)
    await this.tokenRepository.deleteByUserId(user.id)

    return response.ok({ message: 'Password has been reset successfully.' })
  }
}
