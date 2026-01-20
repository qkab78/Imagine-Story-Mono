import { db } from '#services/db'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'

export class KyselySubscriptionRepository extends ISubscriptionRepository {
  async updateUserRole(userId: string, role: number): Promise<void> {
    console.log(`[KyselySubscriptionRepository] Updating user ${userId} role to ${role}`)

    const result = await db
      .updateTable('users')
      .set({ role })
      .where('id', '=', userId)
      .executeTakeFirst()

    console.log(`[KyselySubscriptionRepository] Update result:`, result)
  }
}
