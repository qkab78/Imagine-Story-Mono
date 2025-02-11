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

router.get('/', async ({ response }: HttpContext) => {
  return response.json({ hello: 'world', version: 'v1' })
})

router.get('/protected-route', async ({ response }: HttpContext) => {
  return response.json({ secret: 'data' })
}).middleware(middleware.auth())


router
  .post('/login', [LoginController, 'login'])
  .prefix('/auth')

router.post('/logout', [LogoutController, 'logout'])
  .prefix('/auth')
  .middleware(middleware.auth())