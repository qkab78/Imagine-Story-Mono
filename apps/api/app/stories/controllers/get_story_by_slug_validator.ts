import vine from '@vinejs/vine'

export const getStoryBySlugValidator = vine.compile(
  vine.object({
    slug: vine.string().trim().normalizeUrl({
      stripProtocol: true,
    }),
  })
)
