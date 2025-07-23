import { Job } from '@rlanz/bull-queue'
import mail from '@adonisjs/mail/services/main'

import { Message } from '@adonisjs/mail'
import { join } from 'node:path'
import app from '@adonisjs/core/services/app'
import UserRegistrationConfirmation from '#views/emails/user_registration_confirmation'
import { renderToStream } from '@kitajs/html/suspense'

interface SendUserRegisterConfirmationEmailJobPayload {
  email: string
}

Message.templateEngine = {
  async render(templatePath: string, data: any) {
    const component = (await import(join(app.viewsPath(),templatePath))).default
    return component(data) as unknown as string
  }
}
export default class SendUserRegisterConfirmationEmailJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendUserRegisterConfirmationEmailJobPayload) {
    console.log('Sending user register confirmation email to', payload.email)
    const html = renderToStream(() => <UserRegistrationConfirmation name="John Doe" />)

    await mail.sendLater((message) => {
      message
        .to(payload.email)
        .from('info@example.org')
        .subject('Verify your email address')
        // @ts-ignore
        .html(html)

    })
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(_payload: SendUserRegisterConfirmationEmailJobPayload) { }
}