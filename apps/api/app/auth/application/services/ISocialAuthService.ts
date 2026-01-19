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

export abstract class ISocialAuthService {
  abstract getRedirectUrl(provider: string): Promise<string>
  abstract handleCallback(provider: string): Promise<SocialUserInfo>
}
