import { defineConfig } from '@adonisjs/auth'
import { tokensGuard } from '@adonisjs/auth/access_tokens'
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { configProvider } from '@adonisjs/core'

const authConfig = defineConfig({
  default: 'api',
  guards: {
    api: tokensGuard({
      provider: configProvider.create(async () => {
        const { AccessTokenUserProvider } = await import(
          '#providers/auth_providers/access_token_user_provider'
        )
        return new AccessTokenUserProvider()
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
