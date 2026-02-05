import { useState, useEffect, useCallback } from 'react'
import useSubscriptionStore from '@/store/subscription/subscriptionStore'
import useAuthStore from '@/store/auth/authStore'
import type { SubscriptionStatus } from '@/types/subscription'

interface UseSubscriptionExpiredModalReturn {
  showModal: boolean
  dismissModal: () => void
  expirationDate: string | null
  status: SubscriptionStatus
}

const MODAL_DELAY_MS = 500

export const useSubscriptionExpiredModal = (): UseSubscriptionExpiredModalReturn => {
  const user = useAuthStore((state) => state.user)
  const status = useSubscriptionStore((state) => state.status)
  const expirationDate = useSubscriptionStore((state) => state.expirationDate)
  const expiredModalDismissed = useSubscriptionStore((state) => state.expiredModalDismissed)
  const setExpiredModalDismissed = useSubscriptionStore((state) => state.setExpiredModalDismissed)

  const [isReady, setIsReady] = useState(false)

  // Delay modal appearance to avoid flash on app start
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, MODAL_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  const shouldShowModal =
    isReady &&
    user !== undefined &&
    (status === 'expired' || status === 'cancelled') &&
    expirationDate !== null &&
    !expiredModalDismissed

  const dismissModal = useCallback(() => {
    setExpiredModalDismissed(true)
  }, [setExpiredModalDismissed])

  return {
    showModal: shouldShowModal,
    dismissModal,
    expirationDate,
    status,
  }
}

export default useSubscriptionExpiredModal
