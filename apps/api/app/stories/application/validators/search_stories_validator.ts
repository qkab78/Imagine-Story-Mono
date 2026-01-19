import vine from '@vinejs/vine'

export const searchStoriesValidator = vine.compile(
  vine.object({
    query: vine.string().trim().minLength(1),
    limit: vine.number().optional(),
  })
)
