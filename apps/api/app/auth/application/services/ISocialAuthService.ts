export interface SocialUserInfo {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  accessToken: string
  refreshToken: string | null
  tokenExpiresAt: Date | null
}

/**
 * Abstract context type to avoid coupling with framework-specific HttpContext
 */
export type SocialAuthContext = unknown

export abstract class ISocialAuthService {
  abstract getRedirectUrl(
    provider: string,
    ctx: SocialAuthContext,
    mobileCallbackUrl?: string
  ): Promise<string>
  abstract handleCallback(provider: string, ctx: SocialAuthContext): Promise<SocialUserInfo>
}
