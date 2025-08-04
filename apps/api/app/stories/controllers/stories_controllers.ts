import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { errors } from "@vinejs/vine";
import string from '@adonisjs/core/helpers/string'

import { db } from "#services/db";
import { createStoryValidator } from "./create_story_validator.js";
import { getStoryBySlugValidator } from "./get_story_by_slug_validator.js";
import { getSuggestedStoriesValidator } from "./get_suggested_stories_validator.js";
import { getStoryBySlugPresenter } from "#stories/presenters/get_story_by_slug_presenter";
import { StoryGenerated } from "#stories/types/stories_type";
import { generateImage, generateStory } from "#stories/helpers/stories_helper";
import { getStoriesPresenter } from "#stories/presenters/get_stories_presenter";
import { Stories } from "#types/db";


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

    return response.json(getStoriesPresenter(latestStories as unknown as Stories[]));
  }

  public async getStoryBySlug({ request, response }: HttpContext) {
    const payload = await getStoryBySlugValidator.validate(request.params());
    const stories = await db
      .selectFrom('stories')
      .where('slug', '=', payload.slug)
      .selectAll()
      .executeTakeFirst();

    if (!stories) {
      throw new Error('Story not found');
    }

    // @todo: remove any and check for a way to type the story returned by the database
    return response.json(getStoryBySlugPresenter(stories as any));
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

    const stories = await db
      .selectFrom('stories')
      .where('title', 'ilike', `%${payload.query}%`)
      .limit(50).select(['id', 'title', 'slug', 'cover_image'])
      .execute();

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
    const storyText = await generateStory({
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
    const imageUrl = await generateImage({
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
      protagonist,
      theme,
      child_age: childAge,
      language,
      tone,
      species,
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
}