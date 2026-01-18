import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { SyncSubscriptionUseCase } from '#subscription/application/use-cases/SyncSubscriptionUseCase'
import { syncSubscriptionValidator } from './validators/sync_subscription_validator.js'

@inject()
export default class SubscriptionController {
  constructor(private readonly syncSubscriptionUseCase: SyncSubscriptionUseCase) {}

  public async syncSubscription({ request, auth, response }: HttpContext) {
    console.log('[SubscriptionController] syncSubscription called')

    const user = await auth.getUserOrFail()
    console.log('[SubscriptionController] User:', user.id)

    const payload = await request.validateUsing(syncSubscriptionValidator)
    console.log('[SubscriptionController] Payload:', payload)

    const result = await this.syncSubscriptionUseCase.execute({
      userId: user.id.toString(),
      isPremium: payload.isPremium,
    })

    console.log('[SubscriptionController] Result:', result)
    return response.json(result)
  }
}
