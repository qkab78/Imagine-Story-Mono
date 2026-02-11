import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Ajouter la colonne key
  await db.schema
    .alterTable('themes')
    .addColumn('key', 'varchar(50)', (col) => col.notNull().defaultTo(''))
    .execute()

  // Peupler les clés pour les thèmes existants
  const mappings = [
    { name: 'Animaux et nature', key: 'animals' },
    { name: 'Mystère et enquête', key: 'mystery' },
    { name: 'Courage et dépassement', key: 'courage' },
    { name: 'Aventure et exploration', key: 'adventure' },
    { name: 'Apprentissage et école', key: 'learning' },
    { name: 'Amitié et solidarité', key: 'friendship' },
    { name: 'Famille et foyer', key: 'family' },
    { name: 'Magie et fantastique', key: 'magic' },
  ]

  for (const m of mappings) {
    await db.updateTable('themes').set({ key: m.key }).where('name', '=', m.name).execute()
  }

  // Ajouter index unique sur key
  await db.schema.createIndex('themes_key_unique').on('themes').column('key').unique().execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('themes_key_unique').execute()
  await db.schema.alterTable('themes').dropColumn('key').execute()
}
