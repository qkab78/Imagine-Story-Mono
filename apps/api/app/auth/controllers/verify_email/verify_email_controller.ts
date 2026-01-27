import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { IEmailVerificationTokenRepository } from '../../domain/repositories/i_email_verification_token_repository.js'
import { IAuthUserRepository } from '../../domain/repositories/i_auth_user_repository.js'
import { Role } from '#users/models/role'
import env from '#start/env'

@inject()
export default class VerifyEmailController {
  constructor(
    private readonly tokenRepository: IEmailVerificationTokenRepository,
    private readonly userRepository: IAuthUserRepository
  ) {}

  /**
   * Verify email with token
   * GET /auth/verify-email/:token
   */
  public async verify({ request, response }: HttpContext) {
    const token = request.param('token')

    if (!token) {
      return response.badRequest({ error: 'Token is required' })
    }

    const verificationToken = await this.tokenRepository.findByToken(token)

    if (!verificationToken) {
      return response.badRequest({ error: 'Invalid or expired verification token' })
    }

    if (verificationToken.isExpired()) {
      await this.tokenRepository.deleteByToken(token)
      return response.badRequest({ error: 'Verification token has expired' })
    }

    // Verify the user's email and update role to CUSTOMER
    await this.userRepository.verifyEmail(
      verificationToken.userId,
      new Date(),
      Role.CUSTOMER
    )

    // Delete the used token
    await this.tokenRepository.deleteByToken(token)

    // Redirect to a success page or mobile deep link
    const appUrl = env.get('APP_URL', 'https://imaginestory.app')
    const successUrl = `${appUrl}/email-verified`

    return response.redirect(successUrl)
  }

  /**
   * Verify email with token (JSON response for mobile)
   * POST /auth/verify-email
   */
  public async verifyJson({ request, response }: HttpContext) {
    const { token } = request.body()

    if (!token) {
      return response.badRequest({ error: 'Token is required' })
    }

    const verificationToken = await this.tokenRepository.findByToken(token)

    if (!verificationToken) {
      return response.badRequest({ error: 'Invalid or expired verification token' })
    }

    if (verificationToken.isExpired()) {
      await this.tokenRepository.deleteByToken(token)
      return response.badRequest({ error: 'Verification token has expired' })
    }

    // Verify the user's email and update role to CUSTOMER
    await this.userRepository.verifyEmail(
      verificationToken.userId,
      new Date(),
      Role.CUSTOMER
    )

    // Delete the used token
    await this.tokenRepository.deleteByToken(token)

    // Get updated user
    const user = await this.userRepository.findById(verificationToken.userId)

    if (!user) {
      return response.internalServerError({ error: 'User not found' })
    }

    return response.ok({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: `${user.firstname} ${user.lastname}`,
        role: user.role,
        avatar: '',
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
      },
    })
  }
}
