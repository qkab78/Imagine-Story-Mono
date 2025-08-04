import type { Stories } from '@imagine-story/api/types/db';
import { ALLOWED_LANGUAGES } from '@imagine-story/api/app/stories/constants/allowed_languages';
import { Story } from '@imagine-story/api/stories/entities';

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
  title?: string;
  synopsis: string;
  theme: string;
  token: string;
  protagonist: string;
  childAge: number;
  numberOfChapters: number;
  language: keyof typeof ALLOWED_LANGUAGES;
  tone: string;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const getLatestStories = async (token: string) => {
  if (!token) {
    console.error('No token provided');
    throw new Error('No token provided');
  }

  const response = await fetch(`${apiUrl}/stories/all/latest`, {
    headers: {
      Authorization: token,
    },
  });
  const stories: Story[] = await response.json();
  return stories;
};

export const getStoriesByAuthenticatedUserId = async (token: string) => {
  if (!token) {
    console.error('No token provided');
    throw new Error('No token provided');
  }

  const response = await fetch(`${apiUrl}/stories/user/me`, {
    headers: {
      Authorization: token,
    },
  });
  const stories: Stories[] = await response.json();
  return stories;
};

export const getStories = async (token: string) => {
  const response = await fetch(`${apiUrl}/stories`, {
    headers: {
      Authorization: token,
    },
  });
  const stories: Stories[] = await response.json();
  return stories;
};

export const getSuggestedStories = async (token: string, query: string) => {
  const response = await fetch(`${apiUrl}/stories/search/suggestions?query=${query}`, {
    headers: {
      Authorization: token,
    },
  });
  const stories: Pick<Stories, 'id' | 'title' | 'slug' | 'cover_image'>[] = await response.json();
  return stories;
};

export const createStory = async (payload: CreateStoryFormData) => {
  const response = await fetch(`${apiUrl}/stories`, {
    method: 'POST',
    headers: {
      Authorization: payload.token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const createdStory = await response.json();

  if (createdStory.errors && createdStory.errors.length > 0) {
    throw new Error(createdStory.errors.join(', '));
  }
  return createdStory as Stories;
};

export const getStoryBySlug = async (slug: string) => {
  const response = await fetch(`${apiUrl}/stories/${slug}`);
  const story: Story = await response.json();
  return story;
};