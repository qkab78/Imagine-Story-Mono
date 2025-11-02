import {
  getAuthenticatedUser,
  getCustomer,
  createCustomer,
  lemonSqueezySetup,
  Customer,
  createCheckout,
  getProduct,
} from '@lemonsqueezy/lemonsqueezy.js'
import { inject } from '@adonisjs/core'
import PaymentService from '../payment_service.js'
import PaymentErrors from '#exceptions/payment_errors'
import { db } from '#services/db'

interface CreateSubscriptionPayload {
  customerId: string
  email: string
  name: string
}

@inject()
export default class LemonSqueezyPaymentService implements PaymentService {
  constructor() {
    lemonSqueezySetup({
      apiKey: process.env.PAYMENT_API_KEY,
      onError: (error) => {
        console.error(error)
      },
    })
  }

  public async getPaymentServiceProviderInfos() {
    const { data, error } = await getAuthenticatedUser()

    if (error) {
      throw new Error(error.message)
    }

    console.log(data)
    return data
  }

  public async createSubscription(payload: CreateSubscriptionPayload) {
    const { customerId, email, name } = payload
    let customer: Customer['data']
    let userCustomerId: string

    if (!customerId) {
      const customer = await createCustomer(process.env.PAYMENT_STORE_ID as string, {
        email,
        name,
      })

      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', payload.email)
        .executeTakeFirst()

      if (user) {
        await db
          .updateTable('users')
          .set({
            customer_id: customer.data?.data.id,
          })
          .where('id', '=', user.id)
          .execute()

        userCustomerId = customer.data?.data.id as string
      }
    }

    const response = await getCustomer(customerId || userCustomerId!)

    if (response.error) {
      this.processErrors(response.error.cause! as any[])
    }

    if (!response.data) {
      throw new Error('Customer not found')
    }

    customer = response.data.data
    console.log(customer)

    const productResponse = await getProduct(
      process.env.PAYMENT_PREMIUM_ACCOUNT_PRODUCT_ID as string,
      {
        include: ['variants'],
      }
    )

    if (productResponse.error) {
      throw new Error('Product not found')
    }

    const product = productResponse.data.data

    const checkoutResponse = await createCheckout(
      process.env.PAYMENT_STORE_ID as string,
      product.relationships.variants.data![0].id,
      {
        checkoutData: {
          email,
          name,
          billingAddress: {
            country: 'FR',
          },
        },
        checkoutOptions: {
          embed: true,
          media: true,
          logo: true,
        },
        productOptions: {
          name: product.attributes.name,
          description: product.attributes.description,
        },
        expiresAt: null,
        preview: true,
        testMode: process.env.NODE_ENV !== 'production',
      }
    )

    if (checkoutResponse.error) {
      this.processErrors(checkoutResponse.error.cause! as any[])
    }

    return checkoutResponse.data?.data.attributes.url
  }

  private processErrors(customerErrors: any[]) {
    const errors = customerErrors.map((error: any) => {
      const attributes = error.source.pointer.split('/')
      const attributeName = attributes[attributes.length - 1]
      const errorMessage = error.detail.replace('{0}', `'${attributeName}'`)

      return {
        code: error.status,
        title: error.title,
        message: errorMessage,
      }
    })
    throw new PaymentErrors(errors)
  }
}
