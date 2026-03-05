import { useState } from 'react'
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

  const open = () => {
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const handlePurchase = async () => {
    const result = await purchase()
    if (result.success) {
      Alert.alert('Succès', 'Bienvenue dans la famille Premium !')
      close()
    } else if (result.error) {
      Alert.alert('Erreur', result.error)
    }
  }

  const handleRestore = async () => {
    const success = await restore()
    if (success) {
      Alert.alert('Succès', 'Vos achats ont été restaurés.')
      close()
    } else {
      Alert.alert('Information', 'Aucun achat précédent trouvé.')
    }
  }

  const handleCancel = () => {
    Alert.alert(
      'Gérer l\'abonnement',
      'Vous allez être redirigé vers les paramètres de votre store.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => openManageSubscription() },
      ]
    )
  }

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
