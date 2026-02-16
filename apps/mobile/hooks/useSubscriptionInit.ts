import { useEffect } from 'react';
import useAuthStore from '@/store/auth/authStore';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import { subscriptionService } from '@/services/subscription';
import { getSubscriptionStatus } from '@/api/subscription';

/**
 * Hook qui initialise le service RevenueCat et récupère le statut d'abonnement
 * depuis le backend (source de vérité).
 */
export function useSubscriptionInit() {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const setSubscriptionStatus = useSubscriptionStore(state => state.setSubscriptionStatus);

  useEffect(() => {
    const initSubscription = async () => {
      try {
        // Initialize RevenueCat SDK (needed for purchases and offerings)
        await subscriptionService.initialize(user?.email);

        // Fetch subscription status from backend (source of truth)
        if (token) {
          const status = await getSubscriptionStatus(token);
          setSubscriptionStatus(status);
        }
      } catch (error) {
        console.error('[useSubscriptionInit] Failed to initialize subscription:', error);
      }
    };

    if (user?.email) {
      initSubscription();
    }
  }, [user?.email, token, setSubscriptionStatus]);
}
