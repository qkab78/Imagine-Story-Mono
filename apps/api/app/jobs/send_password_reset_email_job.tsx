import { Job } from '@rlanz/bull-queue'
import mail from '@adonisjs/mail/services/main'
import PasswordResetEmail from '#views/emails/password_reset'
import { renderToStream } from '@kitajs/html/suspense'
import env from '#start/env'

interface SendPasswordResetEmailJobPayload {
  email: string
  firstname: string
  token: string
}

export default class SendPasswordResetEmailJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  async handle(payload: SendPasswordResetEmailJobPayload) {
    console.log('Sending password reset email to', payload.email)

    const apiUrl = env.get('API_URL', 'http://localhost:3333')
    const resetUrl = `${apiUrl}/auth/reset-password?token=${payload.token}`

    const html = renderToStream(() => (
      <PasswordResetEmail
        name={payload.firstname}
        resetUrl={resetUrl}
      />
    ))

    const fromEmail = env.get('MAIL_FROM', 'info@imaginestory.app')

    await mail.sendLater((message) => {
      message
        .to(payload.email)
        .from(fromEmail)
        .subject('Réinitialiser votre mot de passe - Mon petit Conteur')
        // @ts-ignore
        .html(html)
    })
  }

  async rescue(_payload: SendPasswordResetEmailJobPayload) {}
}
