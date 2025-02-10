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

router.get('/', async ({ response }: HttpContext) => {
  return response.json({ hello: 'world', version: 'v1' })
})
