import { DomainException } from '#stories/domain/exceptions/DomainException'

export class OAuthException extends DomainException {
  public readonly provider: string

  constructor(message: string, provider: string, code: string = 'OAUTH_ERROR') {
    super(message, code)
    this.name = 'OAuthException'
    this.provider = provider
  }

  static accessDenied(provider: string): OAuthException {
    return new OAuthException(
      `L'accès a été refusé par l'utilisateur`,
      provider,
      'OAUTH_ACCESS_DENIED'
    )
  }

  static stateMismatch(provider: string): OAuthException {
    return new OAuthException(`Erreur de sécurité: état invalide`, provider, 'OAUTH_STATE_MISMATCH')
  }

  static invalidToken(provider: string): OAuthException {
    return new OAuthException(`Token invalide ou expiré`, provider, 'OAUTH_INVALID_TOKEN')
  }

  static userInfoFailed(provider: string): OAuthException {
    return new OAuthException(
      `Impossible de récupérer les informations utilisateur`,
      provider,
      'OAUTH_USER_INFO_FAILED'
    )
  }
}
