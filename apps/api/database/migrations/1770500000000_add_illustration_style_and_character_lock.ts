import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('illustration_style', 'varchar(50)', (col) => col.defaultTo('japanese-soft'))
    .addColumn('character_visual_lock', 'text', (col) => col.defaultTo(null))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .dropColumn('illustration_style')
    .dropColumn('character_visual_lock')
    .execute()
}
