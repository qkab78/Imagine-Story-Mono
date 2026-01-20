import { Tone } from '#stories/domain/value-objects/settings/tone.vo'
import { ToneId } from '#stories/domain/value-objects/ids/tone_id.vo'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import { db } from '#services/db'

/**
 * Kysely implementation of Tone repository
 *
 * Fetches tone reference data from the database and constructs Tone value objects.
 */
export class KyselyToneRepository implements IToneRepository {
  async findById(id: ToneId): Promise<Tone | null> {
    const toneRow = await db
      .selectFrom('tones')
      .where('id', '=', id.getValue())
      .selectAll()
      .executeTakeFirst()

    if (!toneRow) {
      return null
    }

    return Tone.create(toneRow.id, toneRow.name, toneRow.description ?? '')
  }

  async findAll(): Promise<Tone[]> {
    const toneRows = await db.selectFrom('tones').selectAll().execute()

    return toneRows.map((row) => Tone.create(row.id, row.name, row.description ?? ''))
  }
}
