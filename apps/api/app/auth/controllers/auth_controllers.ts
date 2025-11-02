import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LoginController {
  public async authenticate({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    return response.json({ user })
  }
}
