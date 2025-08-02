import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { errors } from "@vinejs/vine";
import OpenAI from 'openai'
import axios from 'axios'
import fs from 'fs'
import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'

import { db } from "#services/db";
import { createStoryValidator } from "./create_story_validator.js";
import { getStoryBySlugValidator } from "./get_story_by_slug_validator.js";
import { getSuggestedStoriesValidator } from "./get_suggested_stories_validator.js";
import { ALLOWED_LANGUAGES } from "#stories/constants/allowed_languages";
import { LOCALES } from "#stories/constants/locales";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface StoryContentPayload {
  title?: string;
  synopsis?: string;
  theme?: string;
  protagonist?: string;
  childAge?: number;
  numberOfChapters?: number;
  language?: string;
  tone?: string;
  species?: string;
  slug?: string;
}

interface StoryChapter {
  title: string;
  content: string;
}

interface StoryGenerated {
  title: string;
  synopsis: string;
  theme: string;
  protagonist: string;
  childAge: number;
  numberOfChapters: number;
  language: string;
  tone: string;
  species: string;
  chapters: StoryChapter[];
  conclusion: string;
  slug: string;
}

@inject()
export default class StoriesController {

  public async getStories({ response }: HttpContext) {
    const stories = await db.selectFrom('stories').where('public', '=', true).selectAll().execute();

    return response.json(stories);
  }

  public async getLatestStories({ response }: HttpContext) {
    const latestStories = await db.selectFrom('stories')
      .where('public', '=', true)
      .orderBy('created_at', 'desc')
      .limit(5)
      .selectAll()
      .execute();

    return response.json(latestStories);
  }

  public async getStoryBySlug({ request, response }: HttpContext) {
    const payload = await getStoryBySlugValidator.validate(request.params());
    const stories = await db.selectFrom('stories').where('slug', '=', payload.slug).selectAll().executeTakeFirst();

    return response.json(stories);
  }

  public async getStoriesByAuthenticatedUserId({ response, auth }: HttpContext) {
    const user = await auth.authenticate();
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials');
    }


    // @ts-ignore
    const stories = await db.selectFrom('stories').where('user_id', '=', user.id).selectAll().execute();

    return response.json(stories);
  }

  public async getSuggestedStories({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate();
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials');
    }

    const payload = await getSuggestedStoriesValidator.validate(request.qs());

    const stories = await db.selectFrom('stories').where('title', 'like', `${payload.query}%`).limit(50).select(['id', 'title', 'slug', 'cover_image']).execute();

    return response.json(stories);
  }

  public async createStory({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createStoryValidator);
    const {
      title,
      synopsis,
      theme,
      protagonist,
      childAge,
      numberOfChapters,
      language,
      tone,
      species,
      isPrivate
    } = payload;

    const user = await auth.authenticate();

    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials');
    }

    const chapters = numberOfChapters || 5;

    // Générer l'histoire avec un modèle IA
    const storyText = await this.generateStory({
      title,
      synopsis,
      theme,
      protagonist,
      childAge,
      numberOfChapters: chapters,
      language,
      tone,
      species
    });

    const storyTextJson = JSON.parse(storyText) as StoryGenerated;
    const slug = string.slug(storyTextJson.slug, { lower: true, trim: true })

    // Générer une image avec DALL-E
    const imageUrl = await this.generateImage({
      title: storyTextJson.title || '',
      synopsis: storyTextJson.synopsis || '',
      theme: storyTextJson.theme || '',
      childAge: childAge,
      protagonist: storyTextJson.protagonist || '',
      species: storyTextJson.species || '',
      slug
    })

    // Enregistrer en base de données
    const story = await db.insertInto('stories').values({
      title: storyTextJson.title || '',
      synopsis: storyTextJson.synopsis || '',
      // @ts-ignore
      user_id: user.id,
      content: storyText,
      cover_image: imageUrl,
      chapters: storyTextJson.chapters.length,
      slug,
      protagonist: storyTextJson.protagonist || '',
      theme: storyTextJson.theme || '',
      child_age: Number(storyTextJson.childAge) || childAge,
      language: storyTextJson.language || language,
      tone: storyTextJson.tone || tone,
      species: storyTextJson.species || species,
      story_chapters: JSON.stringify(storyTextJson.chapters.map((chapter) => ({
        title: chapter.title,
        content: chapter.content
      }))),
      conclusion: storyTextJson.conclusion || '',
      public: !isPrivate || true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returningAll().execute();

    return response.json(story[0]);
  }

  private async generateStory(payload: StoryContentPayload) {
    const { synopsis, theme, childAge, numberOfChapters, language, protagonist, tone, species } = payload;
    const locale = LOCALES[language?.toUpperCase() as keyof typeof LOCALES] || LOCALES.ENGLISH

    const prompt = `
      You are the best children's storyteller in the world.

      Write an original story for a ${childAge}-year-old child.  
      The story must be divided into exactly ${numberOfChapters} chapters, each with a clear title.  
      It should tell a complete and engaging story, with a beginning, middle, and a **clear ending**.

      The main character is named ${protagonist}, a relatable ${species} of ${childAge} years old.  
      ${synopsis ? `Here is the basic synopsis: "${synopsis}".` : ''}  
      The main theme is: ${theme}.

      The tone of the story is: ${tone}.

      Use simple, vivid, age-appropriate language filled with adventure and imagination.  
      Each chapter should be **around 100–150 words**.  
      At the end of the last chapter, **write a proper conclusion** that wraps up the story, solves the main plot, or delivers a gentle lesson.  
      **Make sure the final chapter ends the story completely, with no cliffhanger.**  
      If the story is too long to fit, **shorten chapters if needed but always include the full ending.**  
      Write the entire story in ${language} (even the title and the conclusion).

      I need you to return the story in the following JSON format:
      {
        "title": "The title of the story",
        "synopsis": "The synopsis of the story",
        "theme": "The theme of the story",
        "protagonist": "The protagonist of the story",
        "childAge": "The age of the protagonist",
        "numberOfChapters": "The number of chapters in the story",
        "language": "The language of the story",
        "tone": "The tone of the story",
        "species": "The species of the protagonist",
        "slug": "The slug of the story",
        "chapters": [
          {
            "title": "The title of the chapter",
            "content": "The content of the chapter"
          }
        ],
        "conclusion": "The conclusion of the story"
      }
    `
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system', content: `
          You are the best children's storyteller in the world. You are writing a story for a child of ${childAge} years old.
          You are writing in ${language} and the tone of the story is ${tone}.
          You know all of those languages: ${Object.values(ALLOWED_LANGUAGES).join(', ')}.
          Generate a title for the story.
          Generate a slug in ${locale} from the title of the story.
        ` },
        { role: 'user', content: prompt }
      ],
    })
    return response.choices[0].message.content?.trim() || ''
  }

  private async generateImage(payload: StoryContentPayload) {
    const { title, synopsis, theme, childAge, protagonist, species, slug } = payload;
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `A colorful and child-friendly illustration inspired by a story titled "${title}".  
        The scene should reflect the following synopsis: ${synopsis}.  
        Show the main character, a ${species} around ${childAge} years old named ${protagonist}, in a setting related to the theme "${theme}".  
        The atmosphere should be magical, warm, and imaginative, with soft lines and vibrant colors.  
        The style should be whimsical and joyful, similar to children's book illustrations.  
        No text, no title, just the visual scene.`,
      size: "1024x1024",
      n: 1
    })
    const imageUrl = response.data?.[0]?.url || ''
    const filename = `${string.slug(slug || `story-${Date.now()}`, { lower: true })}.webp`

    return this.downloadImage(imageUrl, filename)
  }

  private async downloadImage(url: string, filename: string): Promise<string> {
    const imagePath = app.makePath(`uploads/stories/covers/${filename}`)
    const response = await axios.get(url, { responseType: 'arraybuffer' });


    return new Promise((resolve, reject) => {
      fs.writeFile(imagePath, response.data, (err) => {
        if (err) reject(err);
        console.log('Image downloaded successfully!');
      });

      return resolve(imagePath);
    });
  }
}