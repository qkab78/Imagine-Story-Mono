import { Stories } from '@imagine-story/api/types/db';

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
