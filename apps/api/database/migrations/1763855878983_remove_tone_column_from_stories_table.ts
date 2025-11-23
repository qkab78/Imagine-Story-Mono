import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .dropColumn('tone')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('tone', 'varchar', (col) => col.notNull().defaultTo(''))
    .execute()
}

