import { useEffect } from 'react';
import useAuthStore from '@/store/auth/authStore';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import { subscriptionService } from '@/services/subscription';

/**
 * Hook qui initialise le service RevenueCat et récupère les informations d'abonnement.
 */
export function useSubscriptionInit() {
  const user = useAuthStore(state => state.user);
  const setCustomerInfo = useSubscriptionStore(state => state.setCustomerInfo);

  useEffect(() => {
    const initSubscription = async () => {
      try {
        await subscriptionService.initialize(user?.email);

        if (subscriptionService.isInitialized()) {
          const customerInfo = await subscriptionService.getCustomerInfo();
          setCustomerInfo(customerInfo);
        }
      } catch (error) {
        console.error('[useSubscriptionInit] Failed to initialize subscription service:', error);
      }
    };

    if (user?.email) {
      initSubscription();
    }
  }, [user?.email, setCustomerInfo]);
}
