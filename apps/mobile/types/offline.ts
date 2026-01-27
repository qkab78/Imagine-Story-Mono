// Types pour la fonctionnalité de lecture hors ligne

/**
 * Statut de téléchargement d'une histoire
 */
export type DownloadStatus = 'idle' | 'downloading' | 'downloaded' | 'error'

/**
 * Niveau d'accès aux contenus hors ligne selon le statut premium
 * - full: accès complet (premium actif)
 * - grace: période de grâce (7 jours après expiration)
 * - locked: verrouillé (8-30 jours après expiration)
 * - none: aucun accès (> 30 jours ou jamais premium)
 */
export type OfflineAccessLevel = 'full' | 'grace' | 'locked' | 'none'

/**
 * Histoire téléchargée stockée localement
 */
export interface OfflineStory {
  id: string
  title: string
  coverImagePath: string | null
  contentPath: string
  downloadedAt: string // ISO date string
  lastReadAt: string | null // ISO date string
  sizeInBytes: number
}

/**
 * Progression du téléchargement
 */
export interface DownloadProgress {
  storyId: string
  progress: number // 0-100
  status: DownloadStatus
  error?: string
}

/**
 * État global du stockage hors ligne
 */
export interface OfflineStorageState {
  stories: Record<string, OfflineStory>
  downloads: Record<string, DownloadProgress>
  totalSizeBytes: number
}

/**
 * Configuration des limites de téléchargement (depuis le backend)
 */
export interface OfflineConfig {
  maxStories: number
  currentCount: number
  maxSizeBytes: number
  currentSizeBytes: number
}

/**
 * Résultat de la vérification d'accès hors ligne
 */
export interface OfflineAccessCheck {
  level: OfflineAccessLevel
  daysUntilDeletion: number | null
  message: string | null
}
