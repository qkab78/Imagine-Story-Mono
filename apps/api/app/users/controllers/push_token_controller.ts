import type { HttpContext } from '@adonisjs/core/http'
import { db } from '#services/db'

export default class PushTokenController {
  async store({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { pushToken } = request.only(['pushToken'])

    if (!pushToken || typeof pushToken !== 'string') {
      return response.badRequest({ error: 'pushToken is required' })
    }

    await db
      .updateTable('users')
      .set({ push_token: pushToken })
      .where('id', '=', user.id as string)
      .execute()

    return response.json({ success: true })
  }
}
