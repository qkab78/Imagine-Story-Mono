import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { RateLimiterMemory } from 'rate-limiter-flexible'

/**
 * In-memory rate limiters with different configurations.
 * For production with multiple instances, switch to RateLimiterRedis.
 */
const limiters = {
  /** Auth endpoints: 5 requests per 15 minutes */
  auth: new RateLimiterMemory({
    points: 5,
    duration: 15 * 60,
    keyPrefix: 'rl:auth',
  }),
  /** Register: 3 requests per hour */
  register: new RateLimiterMemory({
    points: 3,
    duration: 60 * 60,
    keyPrefix: 'rl:register',
  }),
  /** Webhooks: 60 requests per minute */
  webhook: new RateLimiterMemory({
    points: 60,
    duration: 60,
    keyPrefix: 'rl:webhook',
  }),
  /** Global: 100 requests per minute */
  global: new RateLimiterMemory({
    points: 100,
    duration: 60,
    keyPrefix: 'rl:global',
  }),
}

export type ThrottleType = keyof typeof limiters

export default class ThrottleMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn, options: { type: ThrottleType }) {
    const limiter = limiters[options.type] || limiters.global
    const key = request.ip()

    try {
      const result = await limiter.consume(key)
      response.header('X-RateLimit-Remaining', String(result.remainingPoints))
      response.header('X-RateLimit-Reset', String(Math.ceil(result.msBeforeNext / 1000)))
    } catch (rateLimiterRes: any) {
      response.header('Retry-After', String(Math.ceil(rateLimiterRes.msBeforeNext / 1000)))
      response.header('X-RateLimit-Remaining', '0')
      return response.status(429).json({
        error: 'Too many requests. Please try again later.',
      })
    }

    return next()
  }
}
