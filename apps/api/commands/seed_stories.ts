import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { fakerFR as faker } from '@faker-js/faker'
import { db } from '#services/db'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import { IToneRepository } from '#stories/domain/repositories/ToneRepository'
import { IDateService } from '#stories/domain/services/IDateService'
import { IRandomService } from '#stories/domain/services/IRandomService'
import { StoryFactory } from '#stories/domain/factories/StoryFactory'
import { ChapterFactory } from '#stories/domain/factories/ChapterFactory'

const MOCK_STORIES = [
  {
    title: 'Le Voyage de Luna dans les Étoiles',
    synopsis:
      "Luna découvre un portail magique qui l'emmène dans un voyage extraordinaire à travers les étoiles.",
    protagonist: 'Luna',
    species: 'girl',
    conclusion:
      "Luna rentre chez elle avec des souvenirs merveilleux et la certitude que l'univers est plein de magie.",
    chapters: [
      {
        title: 'Le Portail Mystérieux',
        content:
          "C'était une nuit d'été comme les autres, mais Luna ne pouvait pas dormir. Elle regardait les étoiles par sa fenêtre quand soudain, une lumière brillante apparut dans son jardin. Elle descendit doucement les escaliers et découvrit un portail scintillant entre les rosiers de sa maman.",
      },
      {
        title: 'La Planète des Cristaux',
        content:
          "De l'autre côté du portail, Luna découvrit une planète entièrement faite de cristaux colorés. Chaque pas faisait tinter une mélodie différente. Un petit être lumineux nommé Éclat lui servit de guide.",
      },
      {
        title: 'Le Retour à la Maison',
        content:
          "Après avoir visité trois planètes merveilleuses, Luna savait qu'il était temps de rentrer. Éclat lui offrit un petit cristal qui brillerait toujours pour lui rappeler son aventure. Elle traversa le portail et retrouva son lit douillet.",
      },
    ],
  },
  {
    title: "L'Aventure de Max le Robot",
    synopsis: 'Max est un petit robot qui rêve de découvrir le monde au-delà de son laboratoire.',
    protagonist: 'Max',
    species: 'robot',
    conclusion:
      'Max comprit que la vraie aventure était de partager ses découvertes avec ceux qui nous aiment.',
    chapters: [
      {
        title: 'Le Rêve de Max',
        content:
          "Dans un laboratoire rempli d'inventions incroyables, vivait Max, un petit robot curieux. Chaque jour, il regardait par la fenêtre et se demandait ce qu'il y avait dehors. Un jour, il décida de partir à l'aventure.",
      },
      {
        title: 'La Forêt Enchantée',
        content:
          'Max découvrit une forêt où les arbres parlaient et les fleurs chantaient. Il se fit un ami, un écureuil nommé Noisette, qui lui montra les merveilles de la nature.',
      },
      {
        title: 'La Grande Découverte',
        content:
          "À la fin de son voyage, Max réalisa que le monde était encore plus beau qu'il ne l'avait imaginé. Il rentra au laboratoire pour raconter ses aventures au Professeur qui l'avait créé.",
      },
    ],
  },
  {
    title: 'Super Emma et le Mystère du Parc',
    synopsis:
      "Emma découvre qu'elle a des super-pouvoirs et doit résoudre un mystère dans son parc préféré.",
    protagonist: 'Emma',
    species: 'superheroine',
    conclusion: "Emma apprit que les vrais super-pouvoirs sont la gentillesse et l'entraide.",
    chapters: [
      {
        title: 'Les Pouvoirs Secrets',
        content:
          "Emma était une petite fille ordinaire, jusqu'au jour où elle découvrit qu'elle pouvait faire voler les objets rien qu'en y pensant ! Au début, elle avait peur, mais elle comprit vite que ses pouvoirs pouvaient aider les autres.",
      },
      {
        title: "L'Énigme des Fleurs Disparues",
        content:
          "Toutes les fleurs du parc disparaissaient mystérieusement. Emma utilisa ses pouvoirs pour suivre les indices et découvrit qu'un petit hérisson les collectionnait pour décorer son terrier.",
      },
      {
        title: 'Une Solution pour Tous',
        content:
          "Au lieu de gronder le hérisson, Emma eut une idée brillante. Avec l'aide des jardiniers, ils créèrent un jardin spécial juste pour lui. Tout le monde était content !",
      },
      {
        title: 'La Fête du Parc',
        content:
          "Pour célébrer, les habitants organisèrent une grande fête. Emma était heureuse car elle avait compris que le plus important n'était pas d'avoir des pouvoirs, mais de savoir comment les utiliser pour faire le bien.",
      },
    ],
  },
]

export default class SeedStories extends BaseCommand {
  static commandName = 'seed:stories'
  static description = 'Commande pour générer des histoires de test avec des données mock'

  static options: CommandOptions = {
    startApp: true,
  }

  async completed() {
    await db.destroy()
  }

  async run() {
    this.logger.info('🌱 Seeding stories with mock data...')

    // Récupérer les services via le container IoC
    const storyRepository = await app.container.make(IStoryRepository)
    const themeRepository = await app.container.make(IThemeRepository)
    const languageRepository = await app.container.make(ILanguageRepository)
    const toneRepository = await app.container.make(IToneRepository)
    const dateService = await app.container.make(IDateService)
    const randomService = await app.container.make(IRandomService)

    // Récupérer les métadonnées depuis la base de données
    const [themes, languages, tones] = await Promise.all([
      themeRepository.findAll(),
      languageRepository.findAll(),
      toneRepository.findAll(),
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

    const createdStories = []

    for (const mockStory of MOCK_STORIES) {
      try {
        // Sélectionner aléatoirement theme, language et tone
        const theme = themes[faker.number.int({ min: 0, max: themes.length - 1 })]
        const language = freeLanguages[faker.number.int({ min: 0, max: freeLanguages.length - 1 })]
        const tone = tones[faker.number.int({ min: 0, max: tones.length - 1 })]
        const childAge = faker.number.int({ min: 3, max: 10 })

        // Créer les chapitres
        const chapters = mockStory.chapters.map((chapterData, index) =>
          ChapterFactory.createWithoutImage({
            position: index + 1,
            title: chapterData.title,
            content: chapterData.content,
          })
        )

        // Créer l'histoire avec StoryFactory
        const story = StoryFactory.create(dateService, randomService, {
          title: mockStory.title,
          synopsis: mockStory.synopsis,
          protagonist: mockStory.protagonist,
          childAge,
          species: mockStory.species,
          conclusion: mockStory.conclusion,
          coverImageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/600`,
          ownerId: seedUserId,
          isPublic: true,
          theme,
          language,
          tone,
          chapters,
        })

        // Persister l'histoire
        await storyRepository.create(story)

        createdStories.push(story)
        this.logger.info(`✅ Story created: "${story.title}" (${story.id.getValue()})`)
      } catch (error: any) {
        this.logger.error(`❌ Failed to create story "${mockStory.title}": ${error.message}`)
      }
    }

    this.logger.info(
      `\n📊 Summary: ${createdStories.length}/${MOCK_STORIES.length} stories created`
    )
    this.logger.info('💡 Stories have been inserted directly into the database with mock data')
  }
}
