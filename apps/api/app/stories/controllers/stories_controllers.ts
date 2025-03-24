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

  public async getStoryBuSlug({ request, response }: HttpContext) {
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

    return response.json({ stories });
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
    const imageUrl = await this.generateImage(title, synopsis)

    // // Enregistrer en base de données
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
      Tu es le meilleur compteur d'histoire du monde.
      Écris une histoire pour un enfant âgé de "${childAge}" ans, intitulée "${title}", découpée en ${numberOfChapters} chapitres et sur le thème ${theme}.
      Écris une conclusion à la fin de l'histoire.
      Le nom du protagoniste est ${protagonist}.
      Le synopsis est le suivant "${synopsis}".
      Ecrit l'histoire en ${lang}.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    })
    return response.choices[0].message.content?.trim() || ''
  }

  private async generateImage(title: string, synopsis: string) {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Illustration colorée et adaptée aux enfants pour une histoire intitulée "${title}", avec comme synopsis "${synopsis}"`,
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