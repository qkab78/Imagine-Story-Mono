export abstract class ISubscriptionRepository {
  abstract updateUserRole(userId: string, role: number): Promise<void>
}
