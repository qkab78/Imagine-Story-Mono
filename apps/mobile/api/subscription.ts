const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const syncSubscriptionUrl = `${apiUrl}/subscription/sync`;

export interface SyncSubscriptionResponse {
  success: boolean;
  user: {
    id: string;
    role: number;
  };
}

export const syncSubscriptionToBackend = async (
  token: string,
  isPremium: boolean
): Promise<SyncSubscriptionResponse> => {
  const response = await fetch(syncSubscriptionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({ isPremium }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync subscription');
  }

  return response.json();
};
