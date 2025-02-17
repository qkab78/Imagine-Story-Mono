import vine from '@vinejs/vine'

export const createStoryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    synopsis: vine.string().trim().minLength(6),
    theme: vine.string().trim().minLength(3),
  })
)
