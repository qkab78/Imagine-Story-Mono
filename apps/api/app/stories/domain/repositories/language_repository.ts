import { Language } from '../value-objects/settings/language.vo.js'
import { LanguageId } from '../value-objects/ids/language_id.vo.js'

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
