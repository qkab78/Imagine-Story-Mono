import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { fakerFR as faker } from '@faker-js/faker'
import { StoryContentPayload, StoryGenerated } from '#stories/types/stories_type'
import { ALLOWED_LANGUAGES } from '#stories/constants/allowed_languages'
import { ALLOWED_TONES } from '#stories/constants/allowed_tones'
import { SPECIES } from '#stories/constants/species'
import { ALLOWED_THEMES } from '#stories/constants/themes'
import { generateImage, generateStory } from '#stories/helpers/stories_helper'
import string from '@adonisjs/core/helpers/string'
import { db } from '#services/db'
import env from '#start/env'

export default class SeedStories extends BaseCommand {
  static commandName = 'seed:stories'
  static description = 'Commande pour générer des histoires de test'

  static options: CommandOptions = {
    startApp: true,
  }

  async completed() {
    await db.destroy()
  }

  async run() {
    this.logger.info('Generating stories...')
    const index = faker.number.int({ min: 0, max: ALLOWED_THEMES.length - 1 })
    const storiesToSeed: StoryContentPayload[] = [
      {
        theme: ALLOWED_THEMES[index].name,
        protagonist: faker.person.firstName(),
        childAge: faker.number.int({ min: 3, max: 10 }),
        numberOfChapters: faker.number.int({ min: 3, max: 5 }),
        language: ALLOWED_LANGUAGES.LI,
        tone: ALLOWED_TONES.HAPPY,
        species: SPECIES.ROBOT,
      },
      {
        theme: ALLOWED_THEMES[index].name,
        protagonist: faker.person.firstName(),
        childAge: faker.number.int({ min: 3, max: 10 }),
        numberOfChapters: faker.number.int({ min: 3, max: 5 }),
        language: ALLOWED_LANGUAGES.FR,
        tone: ALLOWED_TONES.MYSTERIOUS,
        species: SPECIES.ANIMAL,
      },
      {
        theme: ALLOWED_THEMES[index].name,
        protagonist: faker.person.firstName(),
        childAge: faker.number.int({ min: 3, max: 10 }),
        numberOfChapters: faker.number.int({ min: 3, max: 5 }),
        language: ALLOWED_LANGUAGES.EN,
        tone: ALLOWED_TONES.CALM,
        species: SPECIES.SUPERHERO,
      },
    ]

    const generatedStories = []
    for (const story of storiesToSeed) {
      const storyContent = await generateStory(story)
      const storyTextJson = JSON.parse(storyContent) as StoryGenerated;
      const slug = string.slug(storyTextJson.slug, { lower: true, trim: true })
  
      // Générer une image avec DALL-E
      const imageUrl = await generateImage({
        title: storyTextJson.title || '',
        synopsis: storyTextJson.synopsis || '',
        theme: storyTextJson.theme || '',
        childAge: Number(story.childAge),
        protagonist: storyTextJson.protagonist || '',
        species: storyTextJson.species || '',
        slug
      })  
      console.log(storyTextJson)
      console.log(imageUrl)
      console.log(slug)
      generatedStories.push({
        ...storyTextJson,
        coverImage: imageUrl,
      })
    }

    console.log(generatedStories)
    for (const story of generatedStories) {
      await db.insertInto('stories').values({
        title: story.title,
        synopsis: story.synopsis,
        theme: story.theme,
        protagonist: story.protagonist,
        child_age: story.childAge,
        cover_image: story.coverImage,
        slug: story.slug,
        chapters: story.chapters.length,
        content: '',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: env.get('SEED_USER_ID') as string,
        story_chapters: JSON.stringify(story.chapters.map((chapter) => ({
          title: chapter.title,
          content: chapter.content
        }))),
        conclusion: story.conclusion,
        public: true,
        language: story.language,
        tone: story.tone,
        species: story.species,
      }).execute() 
    }
    this.logger.info('Stories generated and saved to database')
  }
}