import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import type { HttpContext } from '@adonisjs/core/http'
import PaymentService from '../services/payment_service.js'

@inject()
export default class PaymentsController {
  constructor(private paymentService: PaymentService) {}

  public async getPaymentServiceProviderInfos({ response }: HttpContext) {
    const paymentServiceProviderInfos = await this.paymentService.getPaymentServiceProviderInfos()

    logger.debug('[PaymentsController] Retrieved payment service provider infos')

    return response.json({
      paymentServiceProviderInfos,
    })
  }

  public async createSubscription({ response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()

    const subscriptionUrl = await this.paymentService.createSubscription({
      // @ts-ignore
      customerId: user.customer_id,
      // @ts-ignore
      email: user.email,
      // @ts-ignore
      name: `${user.firstname} ${user.lastname}`,
    })

    return response.json({
      message: 'Subscription created',
      checkoutUrl: subscriptionUrl,
    })
  }
}
