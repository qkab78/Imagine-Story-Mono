import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { contactValidator } from './contact_validator.js'

export default class ContactController {
  async send({ request, response }: HttpContext) {
    const data = await request.validateUsing(contactValidator)

    const contactEmail = process.env.CONTACT_EMAIL || 'support@monpetitconteur.app'
    const fromEmail = process.env.MAIL_FROM || 'noreply@monpetitconteur.app'

    await mail.sendLater((message) => {
      message
        .to(contactEmail)
        .replyTo(data.email)
        .from(fromEmail)
        .subject(`[Contact] ${data.subject} — ${data.firstName}`)
        .html(
          `<h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${data.firstName} ${data.lastName || ''}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <p><strong>Message :</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          ${data.appVersion ? `<p><strong>Version app :</strong> ${data.appVersion}</p>` : ''}
          <p><strong>Newsletter :</strong> ${data.newsletter ? 'Oui' : 'Non'}</p>`
        )
    })

    return response.json({ success: true })
  }
}
