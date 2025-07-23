import type { ApplicationService } from '@adonisjs/core/types'
import LemonSqueezyPaymentService from '#payments/services/lemonsqueezy/lemon_squeezy_payment_service'
import PaymentService from '#payments/services/payment_service'

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
    this.app.container.singleton(PaymentService, () => {
      return new LemonSqueezyPaymentService()
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