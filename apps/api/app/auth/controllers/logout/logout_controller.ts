import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { db } from "#services/db";

@inject()
export default class LoginController {
  public async logout({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail();
    // @ts-ignore
    await db.deleteFrom('access_tokens').where('tokenable_id', '=', user.id).executeTakeFirst();
    return response.noContent();

  }
}