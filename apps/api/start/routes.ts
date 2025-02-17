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

const LoginController = () => import('#auth/controllers/login/login_controller')
const LogoutController = () => import('#auth/controllers/logout/logout_controller')
const StoriesController = () => import('../app/stories/controllers/stories_controllers.js')

router.get('/', async ({ response }: HttpContext) => {
  return response.json({ hello: 'world', version: 'v1' })
})

router.get('/protected-route', async ({ response }: HttpContext) => {
  return response.json({ secret: 'data' })
}).middleware(middleware.auth())

// Stories
router.group(() => {
  router.get('/', [StoriesController, 'getStories'])
  router.get('/:slug', [StoriesController, 'getStoryBuSlug'])
  router.group(() => {
    router.get('/user/me', [StoriesController, 'getStoriesByAuthenticatedUserId'])
    router.post('/', [StoriesController, 'createStory'])
  }).middleware(middleware.auth())
}).prefix('/stories')


// Auth
router
  .post('/login', [LoginController, 'login'])
  .prefix('/auth')

router.post('/logout', [LogoutController, 'logout'])
  .prefix('/auth')
  .middleware(middleware.auth())