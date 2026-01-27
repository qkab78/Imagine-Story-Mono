import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LoginController {
  public async authenticate({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    return response.json({
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: `${user.firstname} ${user.lastname}`.trim(),
        role: user.role,
        avatar: '',
        emailVerifiedAt: user.email_verified_at,
        createdAt: user.created_at,
        currentAccessToken: user.currentAccessToken,
      },
    })
  }
}
