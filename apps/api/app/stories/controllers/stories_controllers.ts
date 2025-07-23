import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { errors } from "@vinejs/vine";
import OpenAI from 'openai'
import axios from 'axios'
import fs from 'fs'
import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'

import { db } from "#services/db";
import { ALLOWED_LANGUAGES, createStoryValidator } from "./create_story_validator.js";
import { getStoryBySlugValidator } from "./get_story_by_slug_validator.js";
import { getSuggestedStoriesValidator } from "./get_suggested_stories_validator.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface StoryContentPayload {
  title: string;
  synopsis: string;
  theme: string;
  protagonist?: string;
  childAge?: number;
  numberOfChapters?: number;
  language?: string;
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
      language
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
      language
    });

    // Générer une image avec DALL-E
    const imageUrl = await this.generateImage({ title, synopsis, theme, childAge, protagonist })

    // Enregistrer en base de données
    const story = await db.insertInto('stories').values({
      title,
      synopsis,
      // @ts-ignore
      user_id: user.id,
      content: storyText,
      cover_image: imageUrl,
      chapters,
      slug: string.slug(title, { lower: true }),
      created_at: new Date(),
      updated_at: new Date(),
    }).returningAll().execute();

    return response.json(story);
  }

  private async generateStory(payload: StoryContentPayload) {
    const { title, synopsis, theme, childAge, numberOfChapters, language, protagonist } = payload;
    const lang = ALLOWED_LANGUAGES[language as keyof typeof ALLOWED_LANGUAGES]
    const prompt = `
      You are the best children's storyteller in the world.

      Write an original story for a ${childAge}-year-old child, titled "${title}".  
      The story must be divided into exactly ${numberOfChapters} chapters (ideally 4 or 5), each with a clear title.  
      It should tell a complete and engaging story, with a beginning, middle, and a **clear ending**.

      The main character is named ${protagonist}, a relatable child of ${childAge} years old.  
      Here is the basic synopsis: "${synopsis}".  
      The main theme is: ${theme}.

      Use simple, vivid, age-appropriate language filled with adventure and imagination.  
      Each chapter should be **around 100–150 words**.  
      At the end of the last chapter, **write a proper conclusion** that wraps up the story, solves the main plot, or delivers a gentle lesson.  
      **Make sure the final chapter ends the story completely, with no cliffhanger.**  
      If the story is too long to fit, **shorten chapters if needed but always include the full ending.**  
      Write the story in ${lang}.
    `
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    })
    return response.choices[0].message.content?.trim() || ''
  }

  private async generateImage(payload: StoryContentPayload) {
    const { title, synopsis, theme, childAge, protagonist } = payload;
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `A colorful and child-friendly illustration inspired by a story titled "${title}".  
        The scene should reflect the following synopsis: ${synopsis}.  
        Show the main character, a child around ${childAge} years old named ${protagonist}, in a setting related to the theme "${theme}".  
        The atmosphere should be magical, warm, and imaginative, with soft lines and vibrant colors.  
        The style should be whimsical and joyful, similar to children's book illustrations.  
        No text, no title, just the visual scene.`,
      size: "1024x1024",
      n: 1
    })
    const imageUrl = response.data[0].url || ''
    const filename = `${string.slug(title, { lower: true })}.webp`

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