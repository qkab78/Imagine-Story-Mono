import { Job } from '@rlanz/bull-queue'
import mail from '@adonisjs/mail/services/main'
import { renderToStream } from '@kitajs/html/suspense'
import StoryGenerationFailedEmail from '#views/emails/story_generation_failed'
import env from '#start/env'

export interface SendStoryGenerationFailedEmailJobPayload {
  recipientEmail: string
  recipientName: string
  storyId: string
  errorMessage: string
}

export default class SendStoryGenerationFailedEmailJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Job configuration
   */
  static get options() {
    return {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 100,
    }
  }

  async handle(payload: SendStoryGenerationFailedEmailJobPayload) {
    console.log(
      `📧 Sending failure email to ${payload.recipientEmail} for story: ${payload.storyId}`
    )

    const frontendUrl = env.get('FRONTEND_URL', 'http://localhost:3333')
    const retryUrl = `${frontendUrl}/dashboard/stories/${payload.storyId}/retry`

    const html = renderToStream(() => (
      <StoryGenerationFailedEmail
        recipientName={payload.recipientName}
        errorMessage={payload.errorMessage}
        retryUrl={retryUrl}
      />
    ))

    await mail.sendLater((message) => {
      message
        .to(payload.recipientEmail)
        .from('noreply@imagine-story.com')
        .subject('Un problème est survenu lors de la génération de votre histoire')
        // @ts-ignore
        .html(html)
    })

    console.log(`✅ Failure email sent to ${payload.recipientEmail}`)
  }

  async rescue(payload: SendStoryGenerationFailedEmailJobPayload, error: Error) {
    console.error(
      `💀 Failed to send failure email to ${payload.recipientEmail} after all retries:`,
      error.message
    )
  }
}
