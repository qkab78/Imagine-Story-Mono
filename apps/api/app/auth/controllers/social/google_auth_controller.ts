import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { GoogleAuthUseCase } from '../../application/use-cases/GoogleAuthUseCase.js'

@inject()
export default class GoogleAuthController {
  constructor(private readonly googleAuthUseCase: GoogleAuthUseCase) {}

  /**
   * Get the Google OAuth redirect URL
   * GET /auth/google/redirect
   */
  async redirect(ctx: HttpContext) {
    const redirectUrl = await this.googleAuthUseCase.getRedirectUrl(ctx)
    return ctx.response.ok({ redirectUrl })
  }

  /**
   * Handle Google OAuth callback
   * GET /auth/google/callback
   */
  async callback(ctx: HttpContext) {
    // Get user info from Google via Ally
    const socialUser = await this.googleAuthUseCase.handleCallback(ctx)

    // Execute use case to create/link user
    const result = await this.googleAuthUseCase.execute(socialUser)

    // Generate access token for the user
    const tokenResult = await (ctx.auth.use('api') as any).authenticateAsClient({
      id: result.user.id,
    })

    return ctx.response.ok({
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
