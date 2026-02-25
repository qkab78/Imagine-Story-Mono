import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import { subscriptionService } from '@/services/subscription';
import { verifySubscription } from '@/api/subscription';

/**
 * Hook qui initialise le service RevenueCat et vérifie le statut d'abonnement
 * via le backend (qui interroge RevenueCat REST API).
 *
 * Utilise POST /subscription/verify au lieu de GET /subscription/status
 * pour garantir que le statut est toujours à jour avec RevenueCat.
 */
export function useSubscriptionInit() {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const setSubscriptionStatus = useSubscriptionStore(state => state.setSubscriptionStatus);

  // Initialize RevenueCat SDK (imperative side effect, not a data fetch)
  useEffect(() => {
    if (user?.email) {
      subscriptionService.initialize(user.email);
    }
  }, [user?.email]);

  // Verify subscription status with RevenueCat via backend (source of truth)
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription', 'verify', token],
    queryFn: () => verifySubscription(token!),
    enabled: !!token && !!user?.email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync status to store
  useEffect(() => {
    if (subscriptionStatus) {
      setSubscriptionStatus(subscriptionStatus);
    }
  }, [subscriptionStatus, setSubscriptionStatus]);
}
