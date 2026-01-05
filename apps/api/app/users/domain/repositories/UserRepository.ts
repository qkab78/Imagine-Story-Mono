import { User } from '../entities/User.entity.js'
import { UserId } from '../value-objects/UserId.vo.js'

/**
 * User Repository Interface
 *
 * Provides read-only access to user data for notification purposes.
 * Full user management is in a separate bounded context.
 */
export abstract class IUserRepository {
  /**
   * Find user by ID
   *
   * @param id - User ID (can be UserId value object or string UUID)
   * @returns User entity or null if not found
   */
  abstract findById(id: UserId | string): Promise<User | null>
}
