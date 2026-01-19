import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { GoogleAuthUseCase } from '../../application/use-cases/GoogleAuthUseCase.js'
import { ISocialAuthService } from '../../application/services/ISocialAuthService.js'

@inject()
export default class GoogleAuthController {
  constructor(
    private readonly googleAuthUseCase: GoogleAuthUseCase,
    private readonly socialAuthService: ISocialAuthService
  ) {}

  /**
   * Get the Google OAuth redirect URL
   * GET /auth/google/redirect
   */
  async redirect({ response }: HttpContext) {
    const redirectUrl = await this.googleAuthUseCase.getRedirectUrl()
    return response.ok({ redirectUrl })
  }

  /**
   * Handle Google OAuth callback
   * GET /auth/google/callback
   */
  async callback({ auth, response }: HttpContext) {
    // Get user info from Google via Ally
    const socialUser = await this.socialAuthService.handleCallback('google')

    // Execute use case to create/link user
    const result = await this.googleAuthUseCase.execute(socialUser)

    // Generate access token for the user
    const tokenResult = await (auth.use('api') as any).authenticateAsClient({
      id: result.user.id,
    })

    return response.ok({
      token: tokenResult.headers?.authorization,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstname: result.user.firstname,
        lastname: result.user.lastname,
        fullname: `${result.user.firstname} ${result.user.lastname}`,
        role: result.user.role,
        avatar: '',
        createdAt: result.user.createdAt,
      },
      isNewUser: result.isNewUser,
    })
  }
}
