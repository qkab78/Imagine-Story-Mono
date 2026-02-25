/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import type { HttpContext } from '@adonisjs/core/http'
import { middleware } from './kernel.js'
import app from '@adonisjs/core/services/app'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import logger from '@adonisjs/core/services/logger'

const LoginController = () => import('#auth/controllers/login/login_controller')
const LogoutController = () => import('#auth/controllers/logout/logout_controller')
const AuthController = () => import('#auth/controllers/auth_controllers')
const RegisterController = () => import('#auth/controllers/register/register_controller')
const PaymentsController = () => import('#payments/controllers/payments_controllers')
const SubscriptionController = () => import('#subscription/controllers/subscription_controller')
const WebhookController = () => import('#subscription/controllers/webhook_controller')

const StoriesControllerPresenter = () => import('#stories/presenters/stories.controller')
const GoogleAuthController = () => import('#auth/controllers/social/google_auth_controller')
const VerifyEmailController = () => import('#auth/controllers/verify_email/verify_email_controller')
const ResendVerificationController = () => import('#auth/controllers/verify_email/resend_verification_controller')

router.get('/', async ({ response }: HttpContext) => {
  return response.json({ hello: 'world', version: 'v1' })
})

router.get('/health', async ({ response }: HttpContext) => {
  const data = { status: 'ok', timestamp: new Date().toISOString() }
  response.status(200)
  response.header('Content-Type', 'application/json')
  return response.send(JSON.stringify(data))
})

router
  .get('/protected-route', async ({ response }: HttpContext) => {
    return response.json({ secret: 'data' })
  })
  .middleware(middleware.auth())

/**
 * Validate image file name to prevent path traversal attacks.
 * Only allows alphanumeric characters, hyphens, underscores, and dots with image extensions.
 */
const SAFE_IMAGE_FILENAME_REGEX = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/

function serveImage(subdir: string) {
  return async ({ request, response }: HttpContext) => {
    const fileName = request.param('fileName')

    if (!SAFE_IMAGE_FILENAME_REGEX.test(fileName)) {
      return response.status(400).json({ error: 'Invalid file name' })
    }

    const uploadsDir = resolve(app.makePath(`uploads/stories/${subdir}`))
    const imagePath = resolve(uploadsDir, fileName)

    // Double-check the resolved path is within the uploads directory
    if (!imagePath.startsWith(uploadsDir)) {
      return response.status(400).json({ error: 'Invalid file name' })
    }

    if (existsSync(imagePath)) {
      return response.send(readFileSync(imagePath), {
        'Content-Type': ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
      } as any)
    } else {
      return response.status(404).json({ error: 'Image not found' })
    }
  }
}

router.get('/images/covers/:fileName', serveImage('covers'))
router.get('/images/chapters/:fileName', serveImage('chapters'))

// Stories
router
  .group(() => {
    // Public endpoints
    router.get('/', [StoriesControllerPresenter, 'getPublicStories'])
    router.get('/all/latest', [StoriesControllerPresenter, 'getLatestPublicStories'])
    router.get('/slug/:slug', [StoriesControllerPresenter, 'getStoryBySlug'])
    router.get('/all/themes', [StoriesControllerPresenter, 'getThemes'])
    router.get('/all/tones', [StoriesControllerPresenter, 'getTones'])
    router.get('/all/languages', [StoriesControllerPresenter, 'getLanguages'])

    // Authenticated endpoints
    router
      .group(() => {
        router.get('/users/me', [StoriesControllerPresenter, 'getUserStories'])
        router.get('/quota', [StoriesControllerPresenter, 'getStoryQuota'])
        router.post('/', [StoriesControllerPresenter, 'createStory'])
        router.post('/:id/retry', [StoriesControllerPresenter, 'retryStoryGeneration'])
        router.get('/search/suggestions', [StoriesControllerPresenter, 'searchStories'])
      })
      .middleware(middleware.auth())

    router.get('/:id', [StoriesControllerPresenter, 'getStoryById'])
    router.get('/:id/status', [StoriesControllerPresenter, 'getGenerationStatus'])
  })
  .prefix('/stories')

// Auth
router
  .group(() => {
    router.post('/login', [LoginController, 'login'])
    router.post('/register', [RegisterController, 'register'])

    // Google OAuth
    router.post('/google/redirect', [GoogleAuthController, 'redirect'])
    router.get('/google/callback', [GoogleAuthController, 'callback'])

    // Email verification (public - accessed via email link)
    router.get('/verify-email/:token', [VerifyEmailController, 'verify'])
    router.post('/verify-email', [VerifyEmailController, 'verifyJson'])

    router
      .group(() => {
        router.post('/logout', [LogoutController, 'logout'])
        router.get('/authenticate', [AuthController, 'authenticate'])
        // Email verification (authenticated - for resending)
        router.post('/resend-verification', [ResendVerificationController, 'resend'])
      })
      .middleware(middleware.auth())
  })
  .prefix('/auth')

// Payments
router
  .group(() => {
    router.get('/provider', [PaymentsController, 'getPaymentServiceProviderInfos'])
    router.post('/create-subscription', [PaymentsController, 'createSubscription'])
  })
  .middleware(middleware.auth())
  .prefix('/payments')

// Subscription
router
  .group(() => {
    router.post('/sync', [SubscriptionController, 'syncSubscription'])
    router.get('/status', [SubscriptionController, 'getStatus'])
    router.post('/verify', [SubscriptionController, 'verifySubscription'])
  })
  .middleware(middleware.auth())
  .prefix('/subscription')

// Webhooks (no authentication required - RevenueCat will send auth header)
router
  .group(() => {
    router.post('/revenuecat', [WebhookController, 'revenueCat'])
  })
  .prefix('/webhooks')
