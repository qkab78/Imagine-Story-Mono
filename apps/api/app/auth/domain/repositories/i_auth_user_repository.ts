import { AuthUser } from '../entities/auth_user.entity.js'

export abstract class IAuthUserRepository {
  abstract findById(id: string): Promise<AuthUser | null>
  abstract findByEmail(email: string): Promise<AuthUser | null>
  abstract create(user: AuthUser): Promise<AuthUser>
  abstract verifyEmail(userId: string, verifiedAt: Date, newRole: number): Promise<void>
}
