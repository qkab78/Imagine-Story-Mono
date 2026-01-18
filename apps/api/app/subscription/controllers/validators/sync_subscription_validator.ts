import vine from '@vinejs/vine'

export const syncSubscriptionValidator = vine.compile(
  vine.object({
    isPremium: vine.boolean(),
  })
)
