import { Job } from '@rlanz/bull-queue'
import mail from '@adonisjs/mail/services/main'
import { renderToStream } from '@kitajs/html/suspense'
import StoryGeneratedSuccessEmail from '#views/emails/story_generated_success'
import env from '#start/env'

export interface SendStoryGeneratedSuccessEmailJobPayload {
  recipientEmail: string
  recipientName: string
  storyTitle: string
  storySlug: string
}

export default class SendStoryGeneratedSuccessEmailJob extends Job {
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
        delay: 2000, // 2s, 10s, 50s
      },
      removeOnComplete: 100,
      removeOnFail: 100,
    }
  }

  async handle(payload: SendStoryGeneratedSuccessEmailJobPayload) {
    console.log(
      `📧 Sending success email to ${payload.recipientEmail} for story: ${payload.storyTitle}`
    )

    const frontendUrl = env.get('FRONTEND_URL', 'http://localhost:3333')
    const storyUrl = `${frontendUrl}/stories/${payload.storySlug}`

    const html = renderToStream(() => (
      <StoryGeneratedSuccessEmail
        recipientName={payload.recipientName}
        storyTitle={payload.storyTitle}
        storyUrl={storyUrl}
      />
    ))

    await mail.sendLater((message) => {
      message
        .to(payload.recipientEmail)
        .from('noreply@imagine-story.com')
        .subject(`Votre histoire "${payload.storyTitle}" est prête ! 📖`)
        // @ts-ignore
        .html(html)
    })

    console.log(`✅ Success email sent to ${payload.recipientEmail}`)
  }

  async rescue(payload: SendStoryGeneratedSuccessEmailJobPayload, error: Error) {
    console.error(
      `💀 Failed to send success email to ${payload.recipientEmail} after all retries:`,
      error.message
    )
  }
}
