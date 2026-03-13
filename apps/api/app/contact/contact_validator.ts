import vine from '@vinejs/vine'

export const contactValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().optional(),
    email: vine.string().trim().email(),
    subject: vine.string().trim().minLength(1),
    message: vine.string().trim().minLength(20),
    appVersion: vine.string().trim().optional(),
    privacyConsent: vine.accepted(),
    newsletter: vine.boolean().optional(),
  })
)
