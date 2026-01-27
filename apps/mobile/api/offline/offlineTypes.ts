/**
 * Types pour l'API offline
 */

export interface OfflineConfigDTO {
  maxStories: number
  maxSizeBytes: number
}

export interface OfflineConfigResponse {
  config: OfflineConfigDTO
}
