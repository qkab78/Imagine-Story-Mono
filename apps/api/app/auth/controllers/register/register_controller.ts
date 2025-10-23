import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { db } from '#services/db'
import { errors } from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'
import { registerValidator } from './register_validator.js'
import queue from '@rlanz/bull-queue/services/main'
import SendUserRegisterConfirmationEmailJob from '#jobs/send_user_register_confirmation_email_job'

@inject()
export default class RegisterController {
  public async register({ request, response, auth }: HttpContext) {
    const { email, password, firstname, lastname } = await request.validateUsing(registerValidator)
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()

    if (user) {
      throw new errors.E_VALIDATION_ERROR('User already exists')
    }
    const hashedPassword = await hash.make(password)
    const newUser = await db
      .insertInto('users')
      .values({
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname,
        role: 1,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirst()

    if (!newUser) {
      throw new errors.E_VALIDATION_ERROR('User not created')
    }

    //@ts-ignore
    const userToLogin = await auth.use('api').authenticateAsClient(newUser)

    queue.dispatch(SendUserRegisterConfirmationEmailJob, {
      email: newUser.email,
    })

    return response.json({
      token: userToLogin.headers?.authorization,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        fullname: `${newUser.firstname} ${newUser.lastname}`,
        role: newUser.role,
        avatar: '',
      },
    })
  }
}
