import { SocialAccount } from '../entities/SocialAccount.entity.js'
import { Provider } from '../value-objects/Provider.vo.js'
import { ProviderUserId } from '../value-objects/ProviderUserId.vo.js'

export abstract class ISocialAccountRepository {
  abstract findByProviderAndUserId(
    provider: Provider,
    providerUserId: ProviderUserId
  ): Promise<SocialAccount | null>

  abstract findByUserIdAndProvider(
    userId: string,
    provider: Provider
  ): Promise<SocialAccount | null>

  abstract create(account: SocialAccount): Promise<SocialAccount>
  abstract update(account: SocialAccount): Promise<void>
  abstract delete(id: string): Promise<void>
}
