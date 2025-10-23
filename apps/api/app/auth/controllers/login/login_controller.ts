import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from './login_validator.js'
import { db } from '#services/db'
import { errors } from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class LoginController {
  public async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()

    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }
    const hasValidPassword = await hash.verify(user.password!, password)
    if (!hasValidPassword) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }
    //@ts-ignore
    const userToLogin = await auth.use('api').authenticateAsClient(user)

    return response.json({
      token: userToLogin.headers?.authorization,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: `${user.firstname} ${user.lastname}`,
        role: user.role,
        avatar: '',
      },
    })
  }
}
