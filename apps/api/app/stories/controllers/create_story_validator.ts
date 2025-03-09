import vine from '@vinejs/vine'

export const ALLOWED_LANGUAGES = {
  FR: 'Français',
  EN: 'English',
  LI: 'Lingala',
} as const;

export const createStoryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    synopsis: vine.string().trim().minLength(6),
    theme: vine.string().trim().minLength(3),
    protagonist: vine.string().trim().optional(),
    childAge: vine.number().optional(),
    numberOfChapters: vine.number().optional(),
    language: vine.enum(Object.keys(ALLOWED_LANGUAGES)).optional(),
  })
)
