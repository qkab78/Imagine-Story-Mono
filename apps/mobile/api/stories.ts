import type { Stories } from '@imagine-story/api/types/db';

export const ALLOWED_LANGUAGES = {
  FR: 'Français',
  EN: 'English',
  LI: 'Lingala',
} as const;

export const THEMES = [
  { id: 1, label: 'Fantaisie', value: 'fantasy' },
  { id: 2, label: 'Science-fiction', value: 'science-fiction' },
  { id: 3, label: 'Historique', value: 'historical' },
  { id: 4, label: 'Policier', value: 'detective' },
  { id: 5, label: 'Aventure', value: 'adventure' },
  { id: 6, label: 'Comédie', value: 'comedy' },
  { id: 7, label: 'Conte', value: 'fable' },
  { id: 8, label: 'Mythe', value: 'myth' },
  { id: 9, label: 'Légende', value: 'legend' },
];

export interface CreateStoryFormData {
  title: string;
  synopsis: string;
  theme: string;
  token: string;
  protagonist?: string;
  childAge?: number;
  numberOfChapters?: number;
  language?: keyof typeof ALLOWED_LANGUAGES;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const getStories = async(token: string) => {
  const response = await fetch(`${apiUrl}/stories`, {
    headers: {
      Authorization: token,
    },
  });
  const stories: Stories[] = await response.json();
  return stories;
};

export const getStoryBySlug = async(slug: string) => {
  const response = await fetch(`${apiUrl}/stories/${slug}`);
  const story: Stories = await response.json();
  return story;
};

export const createStory = async(payload: CreateStoryFormData) => {
  const response = await fetch(`${apiUrl}/stories`, {
    method: 'POST',
    headers: {
      Authorization: payload.token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const createdStory: Stories = await response.json();
  return createdStory;
};
