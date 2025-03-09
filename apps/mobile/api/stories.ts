import type { Stories } from '@imagine-story/api/types/db';

export const ALLOWED_LANGUAGES = {
  FR: 'Français',
  EN: 'English',
  LI: 'Lingala',
} as const;

export const THEMES = [
  { id: 1, label: 'Fantaisie', value: 'fantasy' },
  { id: 2, label: 'Science-fiction', value: 'science-fiction' },
  { id: 3, label: 'Horreur', value: 'horror' },
  { id: 4, label: 'Romance', value: 'romance' },
  { id: 5, label: 'Historique', value: 'historical' },
  { id: 6, label: 'Policier', value: 'detective' },
  { id: 7, label: 'Thriller', value: 'thriller' },
  { id: 8, label: 'Aventure', value: 'adventure' },
  { id: 9, label: 'Drame', value: 'drama' },
  { id: 10, label: 'Comédie', value: 'comedy' },
  { id: 11, label: 'Biographie', value: 'biography' },
  { id: 12, label: 'Autobiographie', value: 'autobiography' },
  { id: 13, label: 'Documentaire', value: 'documentary' },
  { id: 14, label: 'Essai', value: 'essay' },
  { id: 15, label: 'Poésie', value: 'poetry' },
  { id: 16, label: 'Nouvelle', value: 'short-story' },
  { id: 17, label: 'Conte', value: 'fable' },
  { id: 18, label: 'Mythe', value: 'myth' },
  { id: 19, label: 'Légende', value: 'legend' },
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
