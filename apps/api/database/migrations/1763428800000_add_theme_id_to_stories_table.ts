import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('theme_id', 'uuid', (col) => col.references('themes.id').onDelete('set null'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('stories').dropColumn('theme_id').execute()
}
