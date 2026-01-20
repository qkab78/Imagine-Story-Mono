import { ISocialAccountRepository } from '../../domain/repositories/i_social_account_repository.js'
import { SocialAccount } from '../../domain/entities/social_account.entity.js'
import { Provider } from '../../domain/value-objects/provider.vo.js'
import { ProviderUserId } from '../../domain/value-objects/provider_user_id.vo.js'
import { db } from '#services/db'

export class KyselySocialAccountRepository implements ISocialAccountRepository {
  async findByProviderAndUserId(
    provider: Provider,
    providerUserId: ProviderUserId
  ): Promise<SocialAccount | null> {
    const row = await db
      .selectFrom('social_accounts')
      .selectAll()
      .where('provider', '=', provider.getValue())
      .where('provider_user_id', '=', providerUserId.getValue())
      .executeTakeFirst()

    if (!row) return null
    return this.toDomain(row)
  }

  async findByUserIdAndProvider(userId: string, provider: Provider): Promise<SocialAccount | null> {
    const row = await db
      .selectFrom('social_accounts')
      .selectAll()
      .where('user_id', '=', userId)
      .where('provider', '=', provider.getValue())
      .executeTakeFirst()

    if (!row) return null
    return this.toDomain(row)
  }

  async create(account: SocialAccount): Promise<SocialAccount> {
    await db
      .insertInto('social_accounts')
      .values({
        id: account.id,
        user_id: account.userId,
        provider: account.provider.getValue(),
        provider_user_id: account.providerUserId.getValue(),
        email: account.email,
        name: account.name,
        avatar_url: account.avatarUrl,
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
        token_expires_at: account.tokenExpiresAt?.toISOString() ?? null,
        created_at: account.createdAt.toISOString(),
        updated_at: account.updatedAt.toISOString(),
      })
      .execute()

    return account
  }

  async update(account: SocialAccount): Promise<void> {
    await db
      .updateTable('social_accounts')
      .set({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
        token_expires_at: account.tokenExpiresAt?.toISOString() ?? null,
        updated_at: new Date().toISOString(),
      })
      .where('id', '=', account.id)
      .execute()
  }

  async delete(id: string): Promise<void> {
    await db.deleteFrom('social_accounts').where('id', '=', id).execute()
  }

  private toDomain(row: any): SocialAccount {
    return SocialAccount.create({
      id: row.id,
      userId: row.user_id,
      provider: Provider.create(row.provider),
      providerUserId: ProviderUserId.create(row.provider_user_id),
      email: row.email,
      name: row.name,
      avatarUrl: row.avatar_url,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      tokenExpiresAt: row.token_expires_at ? new Date(row.token_expires_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })
  }
}
