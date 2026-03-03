import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { GoogleAuthUseCase } from '../../application/use-cases/google_auth_use_case.js'
import logger from '@adonisjs/core/services/logger'

/**
 * Allowed callback URL patterns to prevent open redirect attacks.
 * Only the app's deep link scheme is permitted.
 */
const ALLOWED_CALLBACK_PATTERNS = [
  /^myapp:\/\//,
  /^imaginestory:\/\//,
]

function isAllowedCallbackUrl(url: string): boolean {
  return ALLOWED_CALLBACK_PATTERNS.some((pattern) => pattern.test(url))
}

@inject()
export default class GoogleAuthController {
  constructor(private readonly googleAuthUseCase: GoogleAuthUseCase) {}

  /**
   * Get the Google OAuth redirect URL
   * POST /auth/google/redirect
   * Body: { callbackUrl: string } - The mobile deep link to redirect to after auth
   */
  async redirect(ctx: HttpContext) {
    const { callbackUrl } = ctx.request.body()

    if (!callbackUrl) {
      return ctx.response.badRequest({ error: 'callbackUrl is required' })
    }

    if (!isAllowedCallbackUrl(callbackUrl)) {
      return ctx.response.badRequest({ error: 'Invalid callback URL' })
    }

    const redirectUrl = await this.googleAuthUseCase.getRedirectUrl(ctx, callbackUrl)
    return ctx.response.ok({ redirectUrl })
  }

  /**
   * Handle Google OAuth callback
   * GET /auth/google/callback
   * Redirects to mobile deep link with auth data
   */
  async callback(ctx: HttpContext) {
    // Get the mobile callback URL from the state parameter
    const state = ctx.request.input('state')
    let mobileCallbackUrl: string | null = null

    if (state) {
      try {
        const stateData = JSON.parse(state)
        if (stateData.callbackUrl && isAllowedCallbackUrl(stateData.callbackUrl)) {
          mobileCallbackUrl = stateData.callbackUrl
        }
      } catch {
        logger.debug('OAuth state is not valid JSON, ignoring')
      }
    }

    // Get user info from Google via Ally
    const socialUser = await this.googleAuthUseCase.handleCallback(ctx)

    // Execute use case to create/link user
    const result = await this.googleAuthUseCase.execute(socialUser)

    // Generate access token for the user
    const tokenResult = await (ctx.auth.use('api') as any).authenticateAsClient({
      id: result.user.id,
    })

    const responseData = {
      token: tokenResult.headers?.authorization,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstname: result.user.firstname,
        lastname: result.user.lastname,
        fullname: `${result.user.firstname} ${result.user.lastname}`,
        role: result.user.role,
        avatar: '',
        isEmailVerified: result.user.emailVerifiedAt !== null,
        createdAt: result.user.createdAt,
      },
      isNewUser: result.isNewUser,
    }

    // If we have a mobile callback URL, redirect to it with the data
    if (mobileCallbackUrl) {
      const encodedData = encodeURIComponent(JSON.stringify(responseData))
      return ctx.response.redirect(`${mobileCallbackUrl}?data=${encodedData}`)
    }

    // Fallback to JSON response for web clients
    return ctx.response.ok(responseData)
  }
}
