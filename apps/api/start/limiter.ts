/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes.
|
*/

import limiter from '@adonisjs/limiter/services/main'

/** Auth endpoints: 5 requests per 15 minutes per IP */
export const authThrottle = limiter.define('auth', (ctx) => {
  return limiter.allowRequests(5).every('15 minutes').usingKey(`auth_${ctx.request.ip()}`)
})

/** Register endpoint: 3 requests per hour per IP */
export const registerThrottle = limiter.define('register', (ctx) => {
  return limiter.allowRequests(3).every('1 hour').usingKey(`register_${ctx.request.ip()}`)
})

/** Webhook endpoints: 60 requests per minute per IP */
export const webhookThrottle = limiter.define('webhook', (ctx) => {
  return limiter.allowRequests(60).every('1 minute').usingKey(`webhook_${ctx.request.ip()}`)
})

/** Global fallback: 100 requests per minute per IP */
export const globalThrottle = limiter.define('global', (ctx) => {
  return limiter.allowRequests(100).every('1 minute').usingKey(`global_${ctx.request.ip()}`)
})
