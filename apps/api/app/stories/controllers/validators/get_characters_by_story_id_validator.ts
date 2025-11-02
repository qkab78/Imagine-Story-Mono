import vine from '@vinejs/vine'

export const getCharactersByStoryIdValidator = vine.compile(
  vine.object({
    id: vine.string().trim().uuid(),
  })
)
