import { STORY_ENDPOINTS } from './stories/storyEndpoints';

export const registerPushToken = async (authToken: string, pushToken: string) => {
  const response = await fetch(STORY_ENDPOINTS.PUSH_TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken,
    },
    body: JSON.stringify({ pushToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to register push token');
  }

  return response.json();
};
