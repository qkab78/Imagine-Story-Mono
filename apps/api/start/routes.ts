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

router.get('/', async ({ response }: HttpContext) => {
  console.log('[Route] GET / called')
  return response.json({ hello: 'world', version: 'v1' })
})

router.get('/health', async ({ response }: HttpContext) => {
  console.log('[Route] GET /health called')
  return response.json({ status: 'ok', timestamp: new Date().toISOString() })
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
    router.get('/', [StoriesController, 'getStories'])
    router.get('/all/latest', [StoriesController, 'getLatestStories'])
    router.get('/slug/:slug', [StoriesController, 'getStoryBySlug'])
    router.get('/:id', [StoriesController, 'getStoryById'])
    router.get('/search/suggestions', [StoriesController, 'getSuggestedStories'])
    router
      .group(() => {
        router.get('/user/me', [StoriesController, 'getStoriesByAuthenticatedUserId'])
        router.post('/', [StoriesController, 'createStory'])

        // Routes pour les personnages
        // router.get('/:id/characters', [CharactersController, 'getCharactersByStoryId'])
        // router.get('/characters/:id', [CharactersController, 'getCharacterById'])
        // router.put('/characters/:id', [CharactersController, 'updateCharacter'])
        // router.delete('/characters/:id', [CharactersController, 'deleteCharacter'])
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
