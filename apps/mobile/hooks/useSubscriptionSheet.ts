import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useSubscription } from './useSubscription'

interface UseSubscriptionSheetReturn {
  // Sheet visibility
  visible: boolean
  open: () => void
  close: () => void
  // Subscription data
  isSubscribed: boolean
  isLoading: boolean
  willRenew: boolean
  price: string
  nextPaymentDate: string | undefined
  // Actions
  handlePurchase: () => Promise<void>
  handleRestore: () => Promise<void>
  handleCancel: () => void
}

export const useSubscriptionSheet = (): UseSubscriptionSheetReturn => {
  const [visible, setVisible] = useState(false)

  const {
    isSubscribed,
    isLoading,
    willRenew,
    getFormattedPrice,
    getFormattedExpirationDate,
    purchase,
    restore,
    openManageSubscription,
  } = useSubscription()

  const open = useCallback(() => {
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
  }, [])

  const handlePurchase = useCallback(async () => {
    const success = await purchase()
    if (success) {
      Alert.alert('Succès', 'Bienvenue dans la famille Premium !')
      close()
    }
  }, [purchase, close])

  const handleRestore = useCallback(async () => {
    const success = await restore()
    if (success) {
      Alert.alert('Succès', 'Vos achats ont été restaurés.')
      close()
    } else {
      Alert.alert('Information', 'Aucun achat précédent trouvé.')
    }
  }, [restore, close])

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Gérer l\'abonnement',
      'Vous allez être redirigé vers les paramètres de votre store.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => openManageSubscription() },
      ]
    )
  }, [openManageSubscription])

  return {
    visible,
    open,
    close,
    isSubscribed,
    isLoading,
    willRenew,
    price: getFormattedPrice(),
    nextPaymentDate: getFormattedExpirationDate() ?? undefined,
    handlePurchase,
    handleRestore,
    handleCancel,
  }
}

export default useSubscriptionSheet
