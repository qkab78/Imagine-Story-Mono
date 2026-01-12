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
import queue from '@rlanz/bull-queue/services/main'
import SendUserRegisterConfirmationEmailJob from '../app/jobs/send_user_register_confirmation_email_job.js'
import app from '@adonisjs/core/services/app'
import { existsSync, readFileSync } from 'node:fs'

const LoginController = () => import('#auth/controllers/login/login_controller')
const LogoutController = () => import('#auth/controllers/logout/logout_controller')
const StoriesController = () => import('#stories/controllers/stories_controllers')
// const CharactersController = () => import('#stories/controllers/characters_controllers')
const AuthController = () => import('#auth/controllers/auth_controllers')
const RegisterController = () => import('#auth/controllers/register/register_controller')
const PaymentsController = () => import('#payments/controllers/payments_controllers')

const StoriesControllerPresenter = () => import('#stories/presenters/stories.controller')

router.get('/', async ({ response }: HttpContext) => {
  console.log('[Route] GET / called')
  try {
    const data = { hello: 'world', version: 'v1' }
    console.log('[Route] GET / preparing response:', data)
    const result = response.json(data)
    console.log('[Route] GET / response created')
    return result
  } catch (error) {
    console.error('[Route] GET / error:', error)
    throw error
  }
})

router.get('/health', async ({ response }: HttpContext) => {
  console.log('[Route] GET /health called - start')
  try {
    const data = { status: 'ok', timestamp: new Date().toISOString() }
    console.log('[Route] GET /health preparing response:', JSON.stringify(data))
    
    // Utiliser response.send avec Content-Type explicite
    response.status(200)
    response.header('Content-Type', 'application/json')
    const result = response.send(JSON.stringify(data))
    
    console.log('[Route] GET /health response sent, status:', response.response.statusCode)
    return result
  } catch (error) {
    console.error('[Route] GET /health error:', error)
    if (error instanceof Error) {
      console.error('[Route] GET /health error stack:', error.stack)
    }
    throw error
  }
})

router.get('/test-register-job', async ({ response }: HttpContext) => {
  queue.dispatch(SendUserRegisterConfirmationEmailJob, {
    email: 'test@test.com',
  })
  return response.json({ hello: 'world', version: 'v1' })
})

router
  .get('/protected-route', async ({ response }: HttpContext) => {
    return response.json({ secret: 'data' })
  })
  .middleware(middleware.auth())

router.get('/images/covers/:fileName', async ({ request, response }: HttpContext) => {
  const fileName = request.param('fileName')
  const imagePath = app.makePath(`uploads/stories/covers/${fileName}`)
  if (existsSync(imagePath)) {
    // Send the image to the client
    return response.send(readFileSync(imagePath), {
      'Content-Type': ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    } as any)
  } else {
    return response.status(404).json({ error: 'Image not found' })
  }
})

router.get('/images/chapters/:fileName', async ({ request, response }: HttpContext) => {
  const fileName = request.param('fileName')
  const imagePath = app.makePath(`uploads/stories/chapters/${fileName}`)
  if (existsSync(imagePath)) {
    return response.send(readFileSync(imagePath), {
      'Content-Type': ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    } as any)
  } else {
    return response.status(404).json({ error: 'Image not found' })
  }
})

// Stories
router
  .group(() => {
    // Clean architecture endpoints (using use cases)
    router.get('/', [StoriesControllerPresenter, 'getPublicStories'])
    router.get('/all/latest', [StoriesControllerPresenter, 'getLatestPublicStories'])
    router.get('/:id', [StoriesControllerPresenter, 'getStoryById'])
    router.get('/:id/status', [StoriesControllerPresenter, 'getGenerationStatus'])

    // Legacy endpoints (to be refactored)
    router.get('/slug/:slug', [StoriesController, 'getStoryBySlug'])
    router.get('/search/suggestions', [StoriesController, 'getSuggestedStories'])
    router.get('/all/themes', [StoriesController, 'getThemes'])
    router.get('/all/tones', [StoriesController, 'getTones'])
    router.get('/all/languages', [StoriesController, 'getLanguages'])

    // Authenticated endpoints
    router
      .group(() => {
        router.get('/users/me/stories', [StoriesControllerPresenter, 'getUserStories'])
        router.post('/', [StoriesControllerPresenter, 'createStory'])
      })
      .middleware(middleware.auth())
  })
  .prefix('/stories')

// Auth
router
  .group(() => {
    router.post('/login', [LoginController, 'login'])
    router.post('/register', [RegisterController, 'register'])
    router
      .group(() => {
        router.post('/logout', [LogoutController, 'logout'])
        router.get('/authenticate', [AuthController, 'authenticate'])
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
