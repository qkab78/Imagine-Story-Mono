import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('themes')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Créer un index unique sur le nom pour éviter les doublons
  await db.schema
    .createIndex('themes_name_unique')
    .on('themes')
    .column('name')
    .unique()
    .execute()

  // Insérer les thèmes populaires pour enfants de 3 à 10 ans
  await db
    .insertInto('themes')
    .values([
      {
        name: 'Aventure et exploration',
        description: 'Histoires d\'aventuriers courageux qui partent à la découverte de nouveaux mondes'
      },
      {
        name: 'Amitié et solidarité',
        description: 'Récits sur l\'importance de l\'amitié et de l\'entraide entre personnages'
      },
      {
        name: 'Magie et fantastique',
        description: 'Contes merveilleux avec des créatures magiques et des pouvoirs extraordinaires'
      },
      {
        name: 'Animaux et nature',
        description: 'Histoires mettant en scène des animaux et la découverte du monde naturel'
      },
      {
        name: 'Famille et foyer',
        description: 'Récits chaleureux sur la vie de famille et les relations familiales'
      },
      {
        name: 'Apprentissage et école',
        description: 'Histoires éducatives sur les découvertes et l\'apprentissage scolaire'
      },
      {
        name: 'Courage et dépassement',
        description: 'Contes inspirants sur le courage face aux défis et la confiance en soi'
      },
      {
        name: 'Mystère et enquête',
        description: 'Histoires d\'investigation adaptées aux enfants avec des énigmes à résoudre'
      }
    ])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('themes').execute()
}