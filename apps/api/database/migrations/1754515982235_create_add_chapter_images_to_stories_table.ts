import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('chapter_images', 'jsonb', (col) => col.defaultTo('[]'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .dropColumn('chapter_images')
    .execute()
}