import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import type { HttpContext } from '@adonisjs/core/http'
import { SyncSubscriptionUseCase } from '#subscription/application/use-cases/sync_subscription_use_case'
import { GetSubscriptionStatusUseCase } from '#subscription/application/use-cases/get_subscription_status_use_case'
import { VerifySubscriptionUseCase } from '#subscription/application/use-cases/verify_subscription_use_case'
import { syncSubscriptionValidator } from './validators/sync_subscription_validator.js'

@inject()
export default class SubscriptionController {
  constructor(
    private readonly syncSubscriptionUseCase: SyncSubscriptionUseCase,
    private readonly getSubscriptionStatusUseCase: GetSubscriptionStatusUseCase,
    private readonly verifySubscriptionUseCase: VerifySubscriptionUseCase
  ) {}

  public async syncSubscription({ request, auth, response }: HttpContext) {
    logger.debug('[SubscriptionController] syncSubscription called')

    const user = await auth.getUserOrFail()
    logger.debug('[SubscriptionController] User: %s', user.id)

    const payload = await request.validateUsing(syncSubscriptionValidator)

    const result = await this.syncSubscriptionUseCase.execute({
      userId: user.id.toString(),
      isPremium: payload.isPremium,
    })

    logger.debug('[SubscriptionController] syncSubscription completed')
    return response.json(result)
  }

  public async getStatus({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const result = await this.getSubscriptionStatusUseCase.execute(user.id.toString())
    return response.json(result)
  }

  public async verifySubscription({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const result = await this.verifySubscriptionUseCase.execute({
      userId: user.id.toString(),
      revenuecatAppUserId: (user as any).email,
    })
    return response.json(result)
  }
}
