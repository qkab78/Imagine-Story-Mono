import vine from '@vinejs/vine'

export const appleAuthValidator = vine.compile(
  vine.object({
    identityToken: vine.string().trim(),
    fullName: vine
      .object({
        firstName: vine.string().trim().nullable().optional(),
        lastName: vine.string().trim().nullable().optional(),
      })
      .nullable()
      .optional(),
    email: vine.string().trim().email().nullable().optional(),
  })
)
