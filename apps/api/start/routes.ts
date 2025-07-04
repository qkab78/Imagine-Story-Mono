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

const LoginController = () => import('#auth/controllers/login/login_controller')
const LogoutController = () => import('#auth/controllers/logout/logout_controller')
const StoriesController = () => import('#stories/controllers/stories_controllers')
const AuthController = () => import('#auth/controllers/auth_controllers')
const RegisterController = () => import('#auth/controllers/register/register_controller')
const PaymentsController = () => import('#payments/controllers/payments_controllers')

router.get('/', async ({ response }: HttpContext) => {
  return response.json({ hello: 'world', version: 'v1' })
})

router.get('/test-register-job', async ({ response }: HttpContext) => {
  queue.dispatch(SendUserRegisterConfirmationEmailJob, {
    email: 'test@test.com'
  })
  return response.json({ hello: 'world', version: 'v1' })
})

router.get('/protected-route', async ({ response }: HttpContext) => {
  return response.json({ secret: 'data' })
}).middleware(middleware.auth())

// Stories
router.group(() => {
  router.get('/', [StoriesController, 'getStories'])
  router.get('/all/latest', [StoriesController, 'getLatestStories'])
  router.get('/:slug', [StoriesController, 'getStoryBySlug'])
  router.get('/search/suggestions', [StoriesController, 'getSuggestedStories'])
  router.group(() => {
    router.get('/user/me', [StoriesController, 'getStoriesByAuthenticatedUserId'])
    router.post('/', [StoriesController, 'createStory'])
  }).middleware(middleware.auth())
}).prefix('/stories')


// Auth
router.group(() => {
  router.post('/login', [LoginController, 'login'])
  router.post('/register', [RegisterController, 'register'])
  router.group(() => {
    router.post('/logout', [LogoutController, 'logout'])
    router.get('/authenticate', [AuthController, 'authenticate'])
  }).middleware(middleware.auth())
}).prefix('/auth')

// Payments
router.group(() => {
  router.get('/provider', [PaymentsController, 'getPaymentServiceProviderInfos'])
  router.post('/create-subscription', [PaymentsController, 'createSubscription'])
}).middleware(middleware.auth()).prefix('/payments')
