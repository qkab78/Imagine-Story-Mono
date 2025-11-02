import vine from '@vinejs/vine'

export const updateCharacterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    role: vine.enum(['protagonist', 'antagonist', 'supporting', 'secondary']).optional(),
    description: vine.string().trim().optional(),
    personality_traits: vine.array(vine.string()).optional(),
    physical_appearance: vine
      .object({
        age: vine.string().optional(),
        height: vine.string().optional(),
        build: vine.string().optional(),
        hair: vine.string().optional(),
        eyes: vine.string().optional(),
        clothing: vine.string().optional(),
        distinctive_features: vine.array(vine.string()).optional(),
      })
      .optional(),
    background_story: vine.string().trim().optional(),
    character_image: vine.string().optional(),
  })
)
