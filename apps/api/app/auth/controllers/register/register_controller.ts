import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { db } from '#services/db'
import { errors } from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'
import { registerValidator } from './register_validator.js'
import queue from '@rlanz/bull-queue/services/main'
import SendUserRegisterConfirmationEmailJob from '#jobs/send_user_register_confirmation_email_job'
import { IEmailVerificationTokenRepository } from '../../domain/repositories/i_email_verification_token_repository.js'
import { EmailVerificationToken } from '../../domain/entities/email_verification_token.entity.js'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { IDateService } from '#stories/domain/services/i_date_service'
import { randomBytes } from 'crypto'

@inject()
export default class RegisterController {
  constructor(
    private readonly tokenRepository: IEmailVerificationTokenRepository,
    private readonly randomService: IRandomService,
    private readonly dateService: IDateService
  ) {}

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
        email_verified_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirst()

    if (!newUser) {
      throw new errors.E_VALIDATION_ERROR('User not created')
    }

    // Generate verification token
    const token = randomBytes(32).toString('hex')
    const now = new Date(this.dateService.now())
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    const verificationToken = EmailVerificationToken.create({
      id: this.randomService.generateRandomUuid(),
      userId: newUser.id,
      token,
      expiresAt,
      createdAt: now,
    })

    await this.tokenRepository.create(verificationToken)

    //@ts-ignore
    const userToLogin = await auth.use('api').authenticateAsClient(newUser)

    // Send verification email with token
    queue.dispatch(SendUserRegisterConfirmationEmailJob, {
      email: newUser.email,
      firstname: newUser.firstname,
      token,
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
        emailVerifiedAt: null,
        createdAt: newUser.created_at,
      },
    })
  }
}
