import { Language } from '#stories/domain/value-objects/settings/Language.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/LanguageId.vo'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import { db } from '#services/db'

/**
 * Kysely implementation of Language repository
 *
 * Fetches language reference data from the database and constructs Language value objects.
 */
export class KyselyLanguageRepository implements ILanguageRepository {
  async findById(id: LanguageId): Promise<Language | null> {
    const languageRow = await db
      .selectFrom('languages')
      .where('id', '=', id.getValue())
      .selectAll()
      .executeTakeFirst()

    if (!languageRow) {
      return null
    }

    return Language.create(languageRow.id, languageRow.name, languageRow.code, languageRow.is_free)
  }

  async findAll(): Promise<Language[]> {
    const languageRows = await db.selectFrom('languages').selectAll().execute()

    return languageRows.map((row) => Language.create(row.id, row.name, row.code, row.is_free))
  }
}
