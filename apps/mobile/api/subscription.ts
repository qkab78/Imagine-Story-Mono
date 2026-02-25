import type { SubscriptionStatusDTO } from '@/types/subscription';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const syncSubscriptionUrl = `${apiUrl}/subscription/sync`;
const subscriptionStatusUrl = `${apiUrl}/subscription/status`;
const verifySubscriptionUrl = `${apiUrl}/subscription/verify`;

export interface SyncSubscriptionResponse {
  success: boolean;
  user: {
    id: string;
    role: number;
  };
}

/**
 * @deprecated Use getSubscriptionStatus() or verifySubscription() instead
 */
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

/**
 * Get the current subscription status from the backend.
 * The backend is the source of truth for subscription state.
 */
export const getSubscriptionStatus = async (
  token: string
): Promise<SubscriptionStatusDTO> => {
  const response = await fetch(subscriptionStatusUrl, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription status');
  }

  return response.json();
};

/**
 * Verify subscription with RevenueCat via the backend.
 * Call this after a purchase or restore to force server-side verification.
 */
export const verifySubscription = async (
  token: string
): Promise<SubscriptionStatusDTO> => {
  const response = await fetch(verifySubscriptionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to verify subscription');
  }

  return response.json();
};
