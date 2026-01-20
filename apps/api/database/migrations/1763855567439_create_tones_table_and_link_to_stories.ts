import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Créer la table tones
  await db.schema
    .createTable('tones')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Créer un index unique sur le nom pour éviter les doublons
  await db.schema.createIndex('tones_name_unique').on('tones').column('name').unique().execute()

  // Insérer les 6 tonalités pour enfants de 3 à 10 ans
  await db
    .insertInto('tones')
    .values([
      {
        name: 'happy',
        description:
          'Tonalité joyeuse et positive, parfaite pour des histoires réconfortantes et optimistes',
      },
      {
        name: 'calm',
        description:
          'Tonalité apaisante et douce, idéale pour des histoires relaxantes avant le coucher',
      },
      {
        name: 'adventurous',
        description:
          "Tonalité aventureuse et excitante, pour des histoires d'exploration et de découverte",
      },
      {
        name: 'magical',
        description:
          'Tonalité magique et merveilleuse, pour des contes fantastiques et imaginaires',
      },
      {
        name: 'educational',
        description: "Tonalité éducative et instructive, pour apprendre en s'amusant",
      },
      {
        name: 'playful',
        description: 'Tonalité amusante et humoristique, pour des histoires drôles et légères',
      },
    ])
    .execute()

  // Ajouter la colonne tone_id à la table stories
  await db.schema
    .alterTable('stories')
    .addColumn('tone_id', 'uuid', (col) => col.references('tones.id').onDelete('set null'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Supprimer la colonne tone_id de la table stories
  await db.schema.alterTable('stories').dropColumn('tone_id').execute()

  // Supprimer la table tones
  await db.schema.dropTable('tones').execute()
}
