import { db } from "#services/db";
import { Users } from "#types/db";
import { symbols } from "@adonisjs/auth";
import { AccessToken } from "@adonisjs/auth/access_tokens";
import { AccessTokensGuardUser, AccessTokensUserProviderContract } from "@adonisjs/auth/types/access_tokens";
import { Secret } from "@adonisjs/core/helpers";
import { randomUUID } from "node:crypto";

export class AccessTokenUserProvider implements AccessTokensUserProviderContract<Users> {
  declare [symbols.PROVIDER_REAL_USER]: Users;

  async createUserForGuard(user: Users): Promise<AccessTokensGuardUser<Users>> {
    return {
      // @ts-ignore
      getId: () => user.id,
      getOriginal: () => user,
    }
  }

  async findById(identifier: string): Promise<AccessTokensGuardUser<Users> | null> {
    const user = await db.selectFrom('users').selectAll().where('id', '=', identifier).executeTakeFirst();

    if (!user) {
      return null
    }

    // @ts-ignore
    return this.createUserForGuard(user)
  }

  async createToken(user: Users, abilities?: string[], options?: { name?: string; expiresIn?: string | number; }): Promise<AccessToken> {
    // @ts-ignore
    const token = await db.selectFrom('access_tokens').selectAll().where('tokenable_id', '=', user.id).executeTakeFirst();
    // @ts-ignore
    const transientToken = AccessToken.createTransientToken(user.id, 1, '30 days')

    if (!token) {
      const token = await db.insertInto('access_tokens').values({
        id: randomUUID().toString(),
        tokenable_id: transientToken.userId as string,
        abilities: abilities?.join() || '',
        type: 'api',
        name: options?.name || 'default',
        hash: transientToken.hash,
        created_at: new Date(),
        updated_at: new Date(),
        expires_at: transientToken.expiresAt,
      }).returningAll().executeTakeFirst();

      if (!token) {
        throw new Error('Could not create token')
      }


      return new AccessToken({
        identifier: token.id,
        name: token.name,
        tokenableId: transientToken.userId as string,
        hash: transientToken.hash,
        abilities: token.abilities.split(','),
        createdAt: token.created_at,
        updatedAt: token.updated_at,
        expiresAt: transientToken.expiresAt || null,
        lastUsedAt: token.last_used_at,
        type: token.type,
        secret: transientToken.secret,
        prefix: 'oat_',
      })
    }

    const accessToken = new AccessToken({
      identifier: token.id,
      name: token.name,
      tokenableId: transientToken.userId as string,
      hash: token.hash,
      abilities: token.abilities.split(','),
      createdAt: token.created_at,
      updatedAt: token.updated_at,
      expiresAt: token.expires_at || null,
      lastUsedAt: token.last_used_at,
      type: token.type,
      secret: transientToken.secret,
      prefix: 'oat_',
    })

    return accessToken
  }
  async verifyToken(tokenValue: Secret<string>): Promise<AccessToken | null> {
    const decodedToken = AccessToken.decode('oat_', tokenValue.release())
    const token = await db.selectFrom('access_tokens').selectAll().where('id', '=', decodedToken!.identifier).executeTakeFirst();

    if (!token) {
      return null
    }

    return new AccessToken({
      identifier: token.id,
      name: token.name,
      tokenableId: token.tokenable_id,
      hash: token.hash,
      abilities: token.abilities.split(','),
      createdAt: token.created_at,
      updatedAt: token.updated_at,
      expiresAt: token.expires_at,
      lastUsedAt: token.last_used_at,
      type: token.type,
      secret: decodedToken!.secret,
      prefix: 'oat_',
    })
  }
}