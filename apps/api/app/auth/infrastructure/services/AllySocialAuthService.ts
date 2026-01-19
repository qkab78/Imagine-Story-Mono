import { HttpContext } from '@adonisjs/core/http'
import type { GoogleDriver } from '@adonisjs/ally/drivers/google'
import { ISocialAuthService, SocialUserInfo } from '../../application/services/ISocialAuthService.js'
import { OAuthException } from '../../domain/exceptions/OAuthException.js'

export class AllySocialAuthService implements ISocialAuthService {
  async getRedirectUrl(provider: string): Promise<string> {
    const ctx = HttpContext.getOrFail()
    const ally = this.getAllyDriver(ctx, provider)
    return ally.redirectUrl()
  }

  async handleCallback(provider: string): Promise<SocialUserInfo> {
    const ctx = HttpContext.getOrFail()
    const ally = this.getAllyDriver(ctx, provider)

    if (ally.accessDenied()) {
      throw OAuthException.accessDenied(provider)
    }

    if (ally.stateMisMatch()) {
      throw OAuthException.stateMismatch(provider)
    }

    if (ally.hasError()) {
      throw new OAuthException(
        ally.getError() || 'Erreur OAuth inconnue',
        provider,
        'OAUTH_PROVIDER_ERROR'
      )
    }

    const user = await ally.user()

    if (!user.email) {
      throw OAuthException.userInfoFailed(provider)
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerificationState === 'verified',
      name: user.name,
      firstName: user.original?.given_name || null,
      lastName: user.original?.family_name || null,
      avatarUrl: user.avatarUrl,
      accessToken: user.token.token,
      refreshToken: user.token.refreshToken || null,
      tokenExpiresAt: user.token.expiresAt ?? null,
    }
  }

  private getAllyDriver(ctx: HttpContext, provider: string): GoogleDriver {
    // Currently only Google is supported
    if (provider !== 'google') {
      throw new OAuthException(`Provider non supporté: ${provider}`, provider, 'OAUTH_UNSUPPORTED_PROVIDER')
    }
    return (ctx.ally as any).use('google') as GoogleDriver
  }
}
