import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine
      .string()
      .trim()
      .minLength(8)
      .regex(/^(?=.*[A-Z])(?=.*\d)/),
    firstname: vine.string().trim().minLength(3),
    lastname: vine.string().trim().minLength(3),
  })
)
