import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { AppleAuthUseCase } from '../../application/use-cases/apple_auth_use_case.js'
import { appleAuthValidator } from './apple_auth_validator.js'
import logger from '@adonisjs/core/services/logger'

const APPLE_JWKS_URL = new URL('https://appleid.apple.com/auth/keys')
const appleJWKS = createRemoteJWKSet(APPLE_JWKS_URL)

@inject()
export default class AppleAuthController {
  constructor(private readonly appleAuthUseCase: AppleAuthUseCase) {}

  /**
   * Handle Apple Sign In callback from mobile app
   * POST /auth/apple/callback
   * Body: { identityToken: string, fullName?: { firstName?, lastName? }, email?: string }
   */
  async callback(ctx: HttpContext) {
    const { identityToken, fullName, email } = await ctx.request.validateUsing(appleAuthValidator)

    // Verify the Apple identity token
    let appleUserId: string
    let tokenEmail: string | null = null

    try {
      const { payload } = await jwtVerify(identityToken, appleJWKS, {
        issuer: 'https://appleid.apple.com',
      })

      appleUserId = payload.sub!
      tokenEmail = (payload.email as string) ?? null
    } catch (error) {
      logger.error({ error }, 'Apple identity token verification failed')
      return ctx.response.unauthorized({ error: { message: 'Invalid Apple identity token' } })
    }

    // Apple only sends email and fullName on FIRST sign-in, use what we have
    const resolvedEmail = email ?? tokenEmail

    const result = await this.appleAuthUseCase.execute({
      appleUserId,
      email: resolvedEmail,
      firstName: fullName?.firstName ?? null,
      lastName: fullName?.lastName ?? null,
    })

    // Generate access token
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
        isEmailVerified: result.user.emailVerifiedAt !== null,
        createdAt: result.user.createdAt,
      },
      isNewUser: result.isNewUser,
    })
  }
}
