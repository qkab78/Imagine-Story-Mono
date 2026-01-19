import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { fakerFR as faker } from '@faker-js/faker'
import { db } from '#services/db'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { QueueStoryCreationUseCase } from '#stories/application/use-cases/QueueStoryCreationUseCase'
import { GetAllThemesUseCase } from '#stories/application/use-cases/metadata/GetAllThemesUseCase'
import { GetAllLanguagesUseCase } from '#stories/application/use-cases/metadata/GetAllLanguagesUseCase'
import { GetAllTonesUseCase } from '#stories/application/use-cases/metadata/GetAllTonesUseCase'

const SPECIES = ['girl', 'boy', 'robot', 'superhero', 'superheroine', 'animal'] as const

export default class SeedStories extends BaseCommand {
  static commandName = 'seed:stories'
  static description = 'Commande pour générer des histoires de test via la queue'

  static options: CommandOptions = {
    startApp: true,
  }

  async completed() {
    await db.destroy()
  }

  async run() {
    this.logger.info('🌱 Seeding stories via queue...')

    // Récupérer les use cases via le container IoC
    const queueStoryCreationUseCase = await app.container.make(QueueStoryCreationUseCase)
    const getAllThemesUseCase = await app.container.make(GetAllThemesUseCase)
    const getAllLanguagesUseCase = await app.container.make(GetAllLanguagesUseCase)
    const getAllTonesUseCase = await app.container.make(GetAllTonesUseCase)

    // Récupérer les métadonnées depuis la base de données
    const [themes, languages, tones] = await Promise.all([
      getAllThemesUseCase.execute(),
      getAllLanguagesUseCase.execute(),
      getAllTonesUseCase.execute(),
    ])

    if (themes.length === 0 || languages.length === 0 || tones.length === 0) {
      this.logger.error('❌ No themes, languages or tones found in database. Run migrations first.')
      return
    }

    const seedUserId = env.get('SEED_USER_ID')
    if (!seedUserId) {
      this.logger.error('❌ SEED_USER_ID not set in environment variables')
      return
    }

    // Filtrer les langues gratuites pour le seed
    const freeLanguages = languages.filter((lang) => lang.isFree)

    // Créer 3 histoires de test
    const storiesToSeed = [
      {
        synopsis: 'Une aventure magique dans un monde enchanté',
        protagonist: faker.person.firstName(),
        childAge: faker.number.int({ min: 3, max: 10 }),
        species: SPECIES[faker.number.int({ min: 0, max: SPECIES.length - 1 })],
        numberOfChapters: faker.number.int({ min: 3, max: 5 }),
        themeId: themes[faker.number.int({ min: 0, max: themes.length - 1 })].id.getValue(),
        languageId: freeLanguages[faker.number.int({ min: 0, max: freeLanguages.length - 1 })].id.getValue(),
        toneId: tones[faker.number.int({ min: 0, max: tones.length - 1 })].id.getValue(),
      },
      {
        synopsis: 'Un voyage extraordinaire à travers les étoiles',
        protagonist: faker.person.firstName(),
        childAge: faker.number.int({ min: 3, max: 10 }),
        species: SPECIES[faker.number.int({ min: 0, max: SPECIES.length - 1 })],
        numberOfChapters: faker.number.int({ min: 3, max: 5 }),
        themeId: themes[faker.number.int({ min: 0, max: themes.length - 1 })].id.getValue(),
        languageId: freeLanguages[faker.number.int({ min: 0, max: freeLanguages.length - 1 })].id.getValue(),
        toneId: tones[faker.number.int({ min: 0, max: tones.length - 1 })].id.getValue(),
      },
      {
        synopsis: 'Une histoire d\'amitié et de courage',
        protagonist: faker.person.firstName(),
        childAge: faker.number.int({ min: 3, max: 10 }),
        species: SPECIES[faker.number.int({ min: 0, max: SPECIES.length - 1 })],
        numberOfChapters: faker.number.int({ min: 3, max: 5 }),
        themeId: themes[faker.number.int({ min: 0, max: themes.length - 1 })].id.getValue(),
        languageId: freeLanguages[faker.number.int({ min: 0, max: freeLanguages.length - 1 })].id.getValue(),
        toneId: tones[faker.number.int({ min: 0, max: tones.length - 1 })].id.getValue(),
      },
    ]

    const queuedStories = []

    for (const storyData of storiesToSeed) {
      try {
        const result = await queueStoryCreationUseCase.execute({
          synopsis: storyData.synopsis,
          protagonist: storyData.protagonist,
          childAge: storyData.childAge,
          species: storyData.species,
          ownerId: seedUserId,
          userRole: 2, // Premium role to bypass quota
          isPublic: true,
          themeId: storyData.themeId,
          languageId: storyData.languageId,
          toneId: storyData.toneId,
          numberOfChapters: storyData.numberOfChapters,
        })

        queuedStories.push(result)
        this.logger.info(`✅ Story queued: ${result.id} (Job: ${result.jobId})`)
      } catch (error: any) {
        this.logger.error(`❌ Failed to queue story: ${error.message}`)
      }
    }

    this.logger.info(`\n📊 Summary: ${queuedStories.length}/${storiesToSeed.length} stories queued`)
    this.logger.info('💡 Stories will be generated asynchronously by the queue worker')
    this.logger.info('💡 Run "node ace queue:listen" to process the queue')
  }
}
