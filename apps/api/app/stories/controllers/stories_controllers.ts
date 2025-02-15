import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { db } from "#services/db";
import { errors } from "@vinejs/vine";

@inject()
export default class StoriesController {

  public async getStories({ response }: HttpContext) {
    const stories = await db.selectFrom('stories').selectAll().execute();
    
    return response.json(stories);
  }

  public async getStoriesByUserId({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate();

    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials');
    }
  }
}