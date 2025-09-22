import env from "#start/env";
import { ALLOWED_LANGUAGES } from "#stories/constants/allowed_languages";
import { LOCALES } from "#stories/constants/locales";
import { StoryContentPayload } from "#stories/types/index";
import OpenAI from "openai";
import string from '@adonisjs/core/helpers/string'
import axios from "axios";
import app from "@adonisjs/core/services/app";
import { writeFile } from "node:fs";
import { 
  generateCoverImageWithLeonardo,
  testLeonardoConnection
} from '../services/leonardo_ai_service.js';
import { StoryGenerationContext } from '../types/enhanced_story_types.js';

const openai = new OpenAI({ apiKey: env.get('OPENAI_API_KEY') })

export async function generateStory(payload: StoryContentPayload) {
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
    Each chapter should be **around 300-600 words**.  
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
        Generate a slug in ${locale} from the title of the story.`
      },
      {
        role: 'user', content: `
          CRITICAL: You MUST return ONLY valid JSON. No explanations, no 
          markdown, no additional text.

          Format EXACTLY like this:
          {"title":"...","synopsis":"...","theme":"...","protagonist":"...","childAge":${childAge},"numberOfChapters":${numberOfChapters},"language":"${language}","tone":"${tone}","species":"${species}","slug":"...","chapters":[{"title":"...","content":"..."}],"conclusion":"..."}
          Write an original story for a ${childAge}-year-old child...
          ${prompt}
          RETURN ONLY THE JSON OBJECT. NO OTHER TEXT.`
      }
    ],
  })
  return response.choices[0].message.content?.trim() || ''
}

export async function generateImage(payload: StoryContentPayload) {
  const { title, synopsis, theme, childAge, protagonist, species, slug } = payload;
  
  // Tenter Leonardo AI en priorité
  const leonardoAvailable = await testLeonardoConnection()
  
  if (leonardoAvailable) {
    console.log('🎨 Génération image de couverture avec Leonardo AI...')
    try {
      const storyContext: StoryGenerationContext & { slug: string } = {
        title: title || '',
        synopsis: synopsis || '',
        theme: theme || '',
        protagonist: protagonist || '',
        childAge: childAge || 5,
        numberOfChapters: 3,
        language: 'fr',
        tone: 'happy',
        species: species || 'animal',
        slug: slug || `story-${Date.now()}`
      }
      
      const leonardoResult = await generateCoverImageWithLeonardo(storyContext)
      if (leonardoResult) {
        console.log('✅ Image de couverture générée avec Leonardo AI')
        return leonardoResult
      }
    } catch (error) {
      console.error('❌ Erreur Leonardo AI pour couverture, fallback DALL-E:', error)
    }
  }
  
  // Fallback sur DALL-E
  console.log('🤖 Génération image de couverture avec DALL-E (fallback)...')
  return await generateImageWithDallE(payload)
}

async function generateImageWithDallE(payload: StoryContentPayload) {
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

  return downloadImage(imageUrl, filename)
}

export async function downloadImage(url: string, filename: string): Promise<string> {
  const imagePath = app.makePath(`uploads/stories/covers/${filename}`)
  const response = await axios.get(url, { responseType: 'arraybuffer' });


  return new Promise((resolve, reject) => {
    writeFile(imagePath, response.data, (err) => {
      if (err) reject(err);
      console.log(`Image downloaded successfully! ${imagePath}`);
    });

    return resolve(imagePath);
  });
}