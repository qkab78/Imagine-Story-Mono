/**
 * Offline API Endpoints
 */

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const OFFLINE_ENDPOINTS = {
  CONFIG: `${apiUrl}/users/me/downloads/config`,
} as const
