import type { OfflineConfigDTO, OfflineConfigResponse } from './offlineTypes'
import { OFFLINE_ENDPOINTS } from './offlineEndpoints'

/**
 * Récupère la configuration des téléchargements offline
 */
export const getOfflineConfig = async (token: string): Promise<OfflineConfigDTO> => {
  if (!token) {
    throw new Error('No token provided')
  }

  const response = await fetch(OFFLINE_ENDPOINTS.CONFIG, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    // Si l'endpoint n'existe pas encore, retourner la config par défaut
    if (response.status === 404) {
      return {
        maxStories: 20,
        maxSizeBytes: 500 * 1024 * 1024, // 500 MB
      }
    }
    throw new Error(`Failed to fetch offline config: ${response.statusText}`)
  }

  const data: OfflineConfigResponse = await response.json()
  return data.config
}
