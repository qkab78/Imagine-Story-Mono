import { HttpContext } from '@adonisjs/core/http'
import type { GoogleDriver } from '@adonisjs/ally/drivers/google'
import { ISocialAuthService, SocialUserInfo, SocialAuthContext } from '../../application/services/ISocialAuthService.js'
import { OAuthException } from '../../domain/exceptions/OAuthException.js'

export class AllySocialAuthService implements ISocialAuthService {
  async getRedirectUrl(
    provider: string,
    ctx: SocialAuthContext,
    mobileCallbackUrl?: string
  ): Promise<string> {
    const httpCtx = ctx as HttpContext
    const ally = this.getAllyDriver(httpCtx, provider)

    if (mobileCallbackUrl) {
      const stateData = JSON.stringify({ callbackUrl: mobileCallbackUrl })
      return ally.stateless().redirectUrl((request) => {
        request.param('state', stateData)
      })
    }

    return ally.redirectUrl()
  }

  async handleCallback(provider: string, ctx: SocialAuthContext): Promise<SocialUserInfo> {
    const httpCtx = ctx as HttpContext
    const ally = this.getAllyDriver(httpCtx, provider)

    // Check if this is a stateless callback (mobile) by looking for our custom state
    const stateParam = httpCtx.request.input('state')
    const isStateless = this.isStatelessCallback(stateParam)

    if (ally.accessDenied()) {
      throw OAuthException.accessDenied(provider)
    }

    // Only check state mismatch for stateful (web) callbacks
    if (!isStateless && ally.stateMisMatch()) {
      throw OAuthException.stateMismatch(provider)
    }

    if (ally.hasError()) {
      throw new OAuthException(
        ally.getError() || 'Erreur OAuth inconnue',
        provider,
        'OAUTH_PROVIDER_ERROR'
      )
    }

    // Use stateless() for mobile callbacks to skip state verification
    const user = isStateless ? await ally.stateless().user() : await ally.user()

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

  /**
   * Check if the state parameter contains our custom mobile callback URL
   * This indicates a stateless (mobile) OAuth flow
   */
  private isStatelessCallback(stateParam: string | null): boolean {
    if (!stateParam) return false
    try {
      const stateData = JSON.parse(stateParam)
      return typeof stateData.callbackUrl === 'string'
    } catch {
      return false
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
