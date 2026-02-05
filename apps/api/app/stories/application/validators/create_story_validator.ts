import vine from '@vinejs/vine'

// Regex pour valider le format UUID v4
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const createStoryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    synopsis: vine.string().trim().minLength(6).optional(),
    theme: vine.string().trim().regex(uuidRegex).optional(),
    protagonist: vine.string().trim().optional(),
    childAge: vine.number().optional(),
    numberOfChapters: vine.number().optional(),
    language: vine.string().trim().regex(uuidRegex).optional(),
    tone: vine.string().trim().regex(uuidRegex).optional(),
    species: vine.string().optional(),
    isPrivate: vine.boolean().optional(),
    generateCharacters: vine.boolean().optional(),
    generateChapterImages: vine.boolean().optional(),
    appearancePreset: vine.string().trim().optional(),
  })
)
