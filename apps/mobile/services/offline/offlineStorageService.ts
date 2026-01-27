import {
  documentDirectory,
  makeDirectoryAsync,
  getInfoAsync,
  writeAsStringAsync,
  readAsStringAsync,
  downloadAsync,
  deleteAsync,
} from 'expo-file-system/legacy'
import type {
  OfflineStory,
  OfflineStorageState,
  DownloadProgress,
  OfflineAccessLevel,
  OfflineAccessCheck,
} from '@/types/offline'

const OFFLINE_DIRECTORY = `${documentDirectory}offline/`
const STORIES_DIRECTORY = `${OFFLINE_DIRECTORY}stories/`
const METADATA_FILE = `${OFFLINE_DIRECTORY}metadata.json`

// Durées en jours pour la gestion post-expiration (depuis env)
const GRACE_PERIOD_DAYS = Number(process.env.EXPO_PUBLIC_OFFLINE_GRACE_PERIOD_DAYS) || 7
const LOCK_PERIOD_DAYS = Number(process.env.EXPO_PUBLIC_OFFLINE_LOCK_PERIOD_DAYS) || 30

interface OfflineChapter {
  id: string
  title: string
  content: string
}

interface StoryContent {
  id: string
  title: string
  chapters: OfflineChapter[]
  coverImageUrl: string | null
}

class OfflineStorageService {
  private isInitialized = false

  /**
   * Initialise le service et crée les répertoires nécessaires
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const dirInfo = await getInfoAsync(OFFLINE_DIRECTORY)
      if (!dirInfo.exists) {
        await makeDirectoryAsync(OFFLINE_DIRECTORY, { intermediates: true })
      }

      const storiesInfo = await getInfoAsync(STORIES_DIRECTORY)
      if (!storiesInfo.exists) {
        await makeDirectoryAsync(STORIES_DIRECTORY, { intermediates: true })
      }

      this.isInitialized = true
    } catch (error) {
      console.error('[OfflineStorage] Failed to initialize:', error)
      throw error
    }
  }

  /**
   * Télécharge une histoire pour la lecture hors ligne
   */
  async downloadStory(
    story: StoryContent,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<OfflineStory> {
    await this.initialize()

    const storyDir = `${STORIES_DIRECTORY}${story.id}/`
    const contentPath = `${storyDir}content.json`
    let coverImagePath: string | null = null
    let totalSize = 0

    try {
      // Créer le répertoire de l'histoire
      await makeDirectoryAsync(storyDir, { intermediates: true })

      onProgress?.({
        storyId: story.id,
        progress: 10,
        status: 'downloading',
      })

      // Sauvegarder le contenu JSON
      await writeAsStringAsync(contentPath, JSON.stringify({
        id: story.id,
        title: story.title,
        chapters: story.chapters,
      }))
      const contentInfo = await getInfoAsync(contentPath)
      if (contentInfo.exists && 'size' in contentInfo) {
        totalSize += contentInfo.size
      }

      onProgress?.({
        storyId: story.id,
        progress: 30,
        status: 'downloading',
      })

      const isUrlValid = story.coverImageUrl ? this.isValidUrl(story.coverImageUrl) : false

      // Télécharger l'image de couverture si disponible et si c'est une URL valide
      if (story.coverImageUrl && isUrlValid) {
        try {
          coverImagePath = `${storyDir}cover.jpg`
          const downloadResult = await downloadAsync(
            story.coverImageUrl,
            coverImagePath
          )
          if (downloadResult.status === 200) {
            const imageInfo = await getInfoAsync(coverImagePath)
            if (imageInfo.exists && 'size' in imageInfo) {
              totalSize += imageInfo.size
            }
          } else {
            coverImagePath = null
          }
        } catch (imageError) {
          console.warn('[OfflineStorage] Failed to download cover image:', imageError)
          coverImagePath = null
        }
      }
      onProgress?.({
        storyId: story.id,
        progress: 80,
        status: 'downloading',
      })

      const offlineStory: OfflineStory = {
        id: story.id,
        title: story.title,
        coverImagePath,
        contentPath,
        downloadedAt: new Date().toISOString(),
        lastReadAt: null,
        sizeInBytes: totalSize,
      }

      // Mettre à jour les métadonnées
      await this.saveStoryMetadata(offlineStory)

      onProgress?.({
        storyId: story.id,
        progress: 100,
        status: 'downloaded',
      })

      return offlineStory
    } catch (error) {
      // Nettoyer en cas d'erreur
      await this.deleteStoryFiles(story.id)

      onProgress?.({
        storyId: story.id,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur de téléchargement',
      })

      throw error
    }
  }

  /**
   * Supprime une histoire téléchargée
   */
  async deleteStory(storyId: string): Promise<void> {
    await this.deleteStoryFiles(storyId)
    await this.removeStoryMetadata(storyId)
  }

  /**
   * Récupère toutes les histoires téléchargées
   */
  async getAllStories(): Promise<OfflineStory[]> {
    await this.initialize()

    try {
      const state = await this.loadState()
      return Object.values(state.stories)
    } catch {
      return []
    }
  }

  /**
   * Récupère une histoire téléchargée par son ID
   */
  async getStory(storyId: string): Promise<OfflineStory | null> {
    const state = await this.loadState()
    return state.stories[storyId] || null
  }

  /**
   * Vérifie si une histoire est téléchargée
   */
  async isStoryDownloaded(storyId: string): Promise<boolean> {
    const story = await this.getStory(storyId)
    return story !== null
  }

  /**
   * Lit le contenu d'une histoire téléchargée
   */
  async readStoryContent(storyId: string): Promise<{ title: string; chapters: OfflineChapter[] } | null> {
    const story = await this.getStory(storyId)
    if (!story) return null

    try {
      const contentJson = await readAsStringAsync(story.contentPath)
      const content = JSON.parse(contentJson)

      // Mettre à jour la date de dernière lecture
      await this.updateLastReadAt(storyId)

      return {
        title: content.title,
        chapters: content.chapters || [],
      }
    } catch (error) {
      console.error('[OfflineStorage] Failed to read story content:', error)
      return null
    }
  }

  /**
   * Met à jour la date de dernière lecture
   */
  async updateLastReadAt(storyId: string): Promise<void> {
    const state = await this.loadState()
    if (state.stories[storyId]) {
      state.stories[storyId].lastReadAt = new Date().toISOString()
      await this.saveState(state)
    }
  }

  /**
   * Calcule l'espace total utilisé
   */
  async getTotalStorageUsed(): Promise<number> {
    const state = await this.loadState()
    return state.totalSizeBytes
  }

  /**
   * Retourne le nombre d'histoires téléchargées
   */
  async getDownloadedCount(): Promise<number> {
    const stories = await this.getAllStories()
    return stories.length
  }

  /**
   * Vérifie le niveau d'accès aux contenus hors ligne
   */
  getAccessLevel(
    isPremium: boolean,
    expirationDate: string | null
  ): OfflineAccessCheck {
    if (isPremium) {
      return {
        level: 'full',
        daysUntilDeletion: null,
        message: null,
      }
    }

    if (!expirationDate) {
      return {
        level: 'none',
        daysUntilDeletion: null,
        message: 'Abonnez-vous pour accéder aux contenus hors ligne.',
      }
    }

    const expDate = new Date(expirationDate)
    const now = new Date()
    const daysSinceExpiration = Math.floor(
      (now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceExpiration <= GRACE_PERIOD_DAYS) {
      const daysRemaining = GRACE_PERIOD_DAYS - daysSinceExpiration
      return {
        level: 'grace',
        daysUntilDeletion: LOCK_PERIOD_DAYS - daysSinceExpiration,
        message: `Période de grâce : ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''} pour renouveler.`,
      }
    }

    if (daysSinceExpiration <= LOCK_PERIOD_DAYS) {
      const daysUntilDeletion = LOCK_PERIOD_DAYS - daysSinceExpiration
      return {
        level: 'locked',
        daysUntilDeletion,
        message: `Vos téléchargements seront supprimés dans ${daysUntilDeletion} jour${daysUntilDeletion > 1 ? 's' : ''}.`,
      }
    }

    return {
      level: 'none',
      daysUntilDeletion: 0,
      message: 'Vos téléchargements ont été supprimés.',
    }
  }

  /**
   * Supprime tous les contenus hors ligne (appelé après 30 jours d'expiration)
   */
  async deleteAllContent(): Promise<void> {
    try {
      const dirInfo = await getInfoAsync(OFFLINE_DIRECTORY)
      if (dirInfo.exists) {
        await deleteAsync(OFFLINE_DIRECTORY, { idempotent: true })
      }
      this.isInitialized = false
    } catch (error) {
      console.error('[OfflineStorage] Failed to delete all content:', error)
      throw error
    }
  }

  /**
   * Formatte la taille en bytes en format lisible
   */
  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  // ==================== Private Methods ====================

  private async loadState(): Promise<OfflineStorageState> {
    try {
      await this.initialize()
      const metadataInfo = await getInfoAsync(METADATA_FILE)
      if (!metadataInfo.exists) {
        return { stories: {}, downloads: {}, totalSizeBytes: 0 }
      }

      const json = await readAsStringAsync(METADATA_FILE)
      return JSON.parse(json)
    } catch {
      return { stories: {}, downloads: {}, totalSizeBytes: 0 }
    }
  }

  private async saveState(state: OfflineStorageState): Promise<void> {
    await writeAsStringAsync(METADATA_FILE, JSON.stringify(state))
  }

  private async saveStoryMetadata(story: OfflineStory): Promise<void> {
    const state = await this.loadState()
    state.stories[story.id] = story
    state.totalSizeBytes = Object.values(state.stories).reduce(
      (total, s) => total + s.sizeInBytes,
      0
    )
    await this.saveState(state)
  }

  private async removeStoryMetadata(storyId: string): Promise<void> {
    const state = await this.loadState()
    delete state.stories[storyId]
    state.totalSizeBytes = Object.values(state.stories).reduce(
      (total, s) => total + s.sizeInBytes,
      0
    )
    await this.saveState(state)
  }

  private async deleteStoryFiles(storyId: string): Promise<void> {
    const storyDir = `${STORIES_DIRECTORY}${storyId}/`
    try {
      const dirInfo = await getInfoAsync(storyDir)
      if (dirInfo.exists) {
        await deleteAsync(storyDir, { idempotent: true })
      }
    } catch (error) {
      console.error('[OfflineStorage] Failed to delete story files:', error)
    }
  }

  private isValidUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://')
  }
}

export const offlineStorageService = new OfflineStorageService()
