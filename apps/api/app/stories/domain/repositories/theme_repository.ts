import { Theme } from '../value-objects/settings/theme.vo.js'
import { ThemeId } from '../value-objects/ids/theme_id.vo.js'

/**
 * Theme repository interface
 *
 * Read-only repository for theme reference data.
 * Themes are managed in a separate bounded context (Settings/Configuration).
 */
export abstract class IThemeRepository {
  abstract findById(id: ThemeId): Promise<Theme | null>
  abstract findAll(): Promise<Theme[]>
}
