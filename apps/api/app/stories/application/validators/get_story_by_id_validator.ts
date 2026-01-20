import vine from '@vinejs/vine'

export const getStoryByIdValidator = vine.compile(
  vine.object({
    id: vine.string().trim().uuid(),
  })
)
