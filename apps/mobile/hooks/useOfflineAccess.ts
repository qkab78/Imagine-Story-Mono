import { useEffect } from 'react'
import useOfflineStore from '@/store/offline/offlineStore'
import useSubscriptionStore from '@/store/subscription/subscriptionStore'
import { offlineStorageService } from '@/services/offline'
import type { OfflineAccessLevel } from '@/types/offline'

interface UseOfflineAccessReturn {
  // Niveau d'accès actuel
  accessLevel: OfflineAccessLevel
  // Message d'avertissement si accès limité
  accessMessage: string | null
  // Jours avant suppression des contenus
  daysUntilDeletion: number | null
  // Peut lire les contenus offline
  canRead: boolean
  // Peut télécharger de nouveaux contenus
  canDownload: boolean
  // Vérifie si l'accès est en période de grâce
  isGracePeriod: boolean
  // Vérifie si les contenus sont verrouillés
  isLocked: boolean
}

/**
 * Hook pour gérer l'accès aux contenus hors ligne
 * basé sur le statut premium de l'utilisateur
 */
export const useOfflineAccess = (): UseOfflineAccessReturn => {
  const { accessLevel, accessMessage, daysUntilDeletion, setAccessLevel } = useOfflineStore()
  const { isSubscribed, expirationDate } = useSubscriptionStore()

  // Mettre à jour le niveau d'accès quand le statut premium change
  useEffect(() => {
    const accessCheck = offlineStorageService.getAccessLevel(isSubscribed, expirationDate)
    setAccessLevel(accessCheck.level, accessCheck.message, accessCheck.daysUntilDeletion)

    // Supprimer tous les contenus si accès perdu depuis plus de 30 jours
    if (accessCheck.level === 'none' && accessCheck.daysUntilDeletion === 0) {
      offlineStorageService.deleteAllContent()
    }
  }, [isSubscribed, expirationDate, setAccessLevel])

  return {
    accessLevel,
    accessMessage,
    daysUntilDeletion,
    canRead: accessLevel === 'full' || accessLevel === 'grace',
    canDownload: accessLevel === 'full',
    isGracePeriod: accessLevel === 'grace',
    isLocked: accessLevel === 'locked',
  }
}

export default useOfflineAccess
