import { Stories } from '@imagine-story/api/types/db';

export interface CreateStoryFormData {
  title: string;
  synopsis: string;
  theme: string;
  token: string;
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
