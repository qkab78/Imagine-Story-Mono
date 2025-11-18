import vine from '@vinejs/vine'

export const getSuggestedStoriesValidator = vine.compile(
  vine.object({
    query: vine.string().trim().minLength(1),
  })
)
