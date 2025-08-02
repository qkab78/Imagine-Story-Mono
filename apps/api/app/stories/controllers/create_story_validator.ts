import vine from '@vinejs/vine'

export const createStoryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    synopsis: vine.string().trim().minLength(6).optional(),
    theme: vine.string().trim().minLength(3).optional(),
    protagonist: vine.string().trim().optional(),
    childAge: vine.number().optional(),
    numberOfChapters: vine.number().optional(),
    language: vine.string().optional(),
    tone: vine.string().optional(),
    species: vine.string().optional(),
    isPrivate: vine.boolean().optional(),
    // language: vine.enum(Object.keys(ALLOWED_LANGUAGES)).optional(),
    // tone: vine.enum(Object.keys(ALLOWED_TONES)).optional(),
  })
)
