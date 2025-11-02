import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('protagonist', 'varchar', (col) => col.notNull().defaultTo(''))
    .addColumn('theme', 'varchar', (col) => col.notNull().defaultTo(''))
    .addColumn('child_age', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('language', 'varchar', (col) => col.notNull().defaultTo(''))
    .addColumn('tone', 'varchar', (col) => col.notNull().defaultTo(''))
    .addColumn('species', 'varchar', (col) => col.notNull().defaultTo(''))
    .addColumn('conclusion', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('story_chapters', 'jsonb', (col) => col.notNull().defaultTo('[]'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .dropColumn('protagonist')
    .dropColumn('theme')
    .dropColumn('child_age')
    .dropColumn('language')
    .dropColumn('tone')
    .dropColumn('species')
    .dropColumn('conclusion')
    .dropColumn('story_chapters')
    .execute()
}
