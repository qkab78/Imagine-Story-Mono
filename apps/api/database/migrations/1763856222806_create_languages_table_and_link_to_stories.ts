import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Créer la table languages
  await db.schema
    .createTable('languages')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('code', 'varchar(10)', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('is_free', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Créer un index unique sur le code pour éviter les doublons
  await db.schema
    .createIndex('languages_code_unique')
    .on('languages')
    .column('code')
    .unique()
    .execute()

  // Insérer les langues (français et anglais sont gratuites)
  await db
    .insertInto('languages')
    .values([
      {
        code: 'FR',
        name: 'French',
        is_free: true
      },
      {
        code: 'EN',
        name: 'English',
        is_free: true
      },
      {
        code: 'LI',
        name: 'Lingala',
        is_free: false
      },
      {
        code: 'ES',
        name: 'Spanish',
        is_free: false
      },
      {
        code: 'PT',
        name: 'Portuguese',
        is_free: false
      },
      {
        code: 'DE',
        name: 'Deutsch',
        is_free: false
      },
      {
        code: 'IT',
        name: 'Italiano',
        is_free: false
      },
      {
        code: 'NL',
        name: 'Nederlands',
        is_free: false
      },
      {
        code: 'PL',
        name: 'Polski',
        is_free: false
      },
      {
        code: 'RU',
        name: 'Russian',
        is_free: false
      },
      {
        code: 'TR',
        name: 'Turkish',
        is_free: false
      },
      {
        code: 'AR',
        name: 'Arabic',
        is_free: false
      },
      {
        code: 'JA',
        name: 'Japanese',
        is_free: false
      }
    ])
    .execute()

  // Ajouter la colonne language_id à la table stories
  await db.schema
    .alterTable('stories')
    .addColumn('language_id', 'uuid', (col) => col
      .references('languages.id')
      .onDelete('set null')
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Supprimer la colonne language_id de la table stories
  await db.schema
    .alterTable('stories')
    .dropColumn('language_id')
    .execute()

  // Supprimer la table languages
  await db.schema.dropTable('languages').execute()
}

