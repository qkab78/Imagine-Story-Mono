import { z } from 'zod'

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'required'),
  lastName: z.string().optional().default(''),
  email: z.string().email('invalidEmail'),
  subject: z.string().min(1, 'required'),
  message: z.string().min(20, 'messageMinLength'),
  appVersion: z.string().optional().default(''),
  privacyConsent: z.boolean().refine((v) => v === true, { message: 'consentRequired' }),
  newsletter: z.boolean().optional().default(false),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean }> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('submitError')
  }

  return response.json()
}
