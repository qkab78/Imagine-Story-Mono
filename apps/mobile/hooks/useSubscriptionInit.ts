import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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

  // Initialize RevenueCat SDK (imperative side effect, not a data fetch)
  useEffect(() => {
    if (user?.email) {
      subscriptionService.initialize(user.email);
    }
  }, [user?.email]);

  // Fetch subscription status from backend (source of truth)
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription', 'init-status', token],
    queryFn: () => getSubscriptionStatus(token!),
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
