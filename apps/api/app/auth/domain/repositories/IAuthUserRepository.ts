import { AuthUser } from '../entities/AuthUser.entity.js'

export abstract class IAuthUserRepository {
  abstract findById(id: string): Promise<AuthUser | null>
  abstract findByEmail(email: string): Promise<AuthUser | null>
  abstract create(user: AuthUser): Promise<AuthUser>
}
