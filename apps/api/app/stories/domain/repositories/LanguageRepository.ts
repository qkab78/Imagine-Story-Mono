import { Language } from '../value-objects/settings/Language.vo.js'
import { LanguageId } from '../value-objects/ids/LanguageId.vo.js'

/**
 * Language repository interface
 *
 * Read-only repository for language reference data.
 * Languages are managed in a separate bounded context (Settings/Configuration).
 */
export abstract class ILanguageRepository {
  abstract findById(id: LanguageId): Promise<Language | null>
  abstract findAll(): Promise<Language[]>
}
