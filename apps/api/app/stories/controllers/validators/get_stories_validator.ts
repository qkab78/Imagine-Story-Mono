import vine from '@vinejs/vine'

export const getStoriesValidator = vine.compile(
  vine.object({
    limit: vine.number().min(1).max(100).optional(),
  })
)
