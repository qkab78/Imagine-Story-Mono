import type { ApplicationService } from '@adonisjs/core/types'
import LemonSqueezyPaymentService from '#payments/services/lemonsqueezy/lemon_squeezy_payment_service'
import PaymentService from '#payments/services/payment_service'
import { IDateService } from '#stories/domain/services/IDateService'
import { IRandomService } from '#stories/domain/services/IRandomService'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const { DateService } = await import('#stories/infrastructure/adapters/services/date.service')
    const { RandomService } = await import('#stories/infrastructure/adapters/services/random.service')
    const { KyselyStoryRepository } = await import('#stories/infrastructure/adapters/repositories/KyselyStoryRepository')

    this.app.container.singleton(PaymentService, () => {
      return new LemonSqueezyPaymentService()
    })
    this.app.container.singleton(IDateService, () => {
      return this.app.container.make(DateService)
    })
    this.app.container.singleton(IRandomService, () => {
      return this.app.container.make(RandomService)
    })
    this.app.container.singleton(IStoryRepository, () => {
      return this.app.container.make(KyselyStoryRepository)
    })
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
