import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('stories').dropColumn('language').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('language', 'varchar', (col) => col.notNull().defaultTo(''))
    .execute()
}
