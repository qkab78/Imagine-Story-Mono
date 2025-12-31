import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import { Theme } from '#stories/domain/value-objects/settings/Theme.vo'
import { ThemeId } from '#stories/domain/value-objects/ids/ThemeId.vo'
import { db } from '#services/db'

/**
 * Kysely implementation of Theme repository
 *
 * Fetches theme reference data from the database and constructs Theme value objects.
 */
export class KyselyThemeRepository implements IThemeRepository {
  async findById(id: ThemeId): Promise<Theme | null> {
    const themeRow = await db
      .selectFrom('themes')
      .where('id', '=', id.getValue())
      .selectAll()
      .executeTakeFirst()

    if (!themeRow) {
      return null
    }

    return Theme.create(themeRow.id, themeRow.name, themeRow.description)
  }

  async findAll(): Promise<Theme[]> {
    const themeRows = await db.selectFrom('themes').selectAll().execute()

    return themeRows.map((row) => Theme.create(row.id, row.name, row.description))
  }
}