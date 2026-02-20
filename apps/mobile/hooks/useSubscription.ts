import { useCallback, useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import useAuthStore from '@/store/auth/authStore';
import useQuotaStore from '@/store/quota/quotaStore';
import { subscriptionService } from '@/services/subscription';
import { getSubscriptionStatus, verifySubscription } from '@/api/subscription';
import { OFFERING_ID } from '@/types/subscription';

export const useSubscription = () => {
  const queryClient = useQueryClient();
  const { token, user, setUser } = useAuthStore();
  const { reset: resetQuota } = useQuotaStore();
  const {
    status,
    isSubscribed,
    hasAccess,
    offerings,
    monthlyPackage,
    expirationDate,
    willRenew,
    isLoading,
    error,
    managementUrl,
    setSubscriptionStatus,
    setOfferings,
    setLoading,
    setError,
    reset,
  } = useSubscriptionStore();

  const initialize = useCallback(async () => {
    if (!subscriptionService.isInitialized()) {
      try {
        await subscriptionService.initialize(user?.email);
      } catch (err) {
        console.error('[useSubscription] Failed to initialize:', err);
      }
    }
  }, [user?.email]);

  /**
   * Refresh subscription status from the backend (source of truth)
   * and offerings from RevenueCat SDK (prices from Apple/Google).
   */
  const refresh = useCallback(async () => {
    if (!subscriptionService.isInitialized()) {
      await initialize();
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch status from backend and offerings from SDK in parallel
      const statusPromise = token
        ? getSubscriptionStatus(token)
        : Promise.resolve(null);
      const offeringsPromise = subscriptionService.getOfferings(OFFERING_ID);

      const [statusResult, offeringsResult] = await Promise.all([
        statusPromise,
        offeringsPromise,
      ]);

      if (statusResult) {
        setSubscriptionStatus(statusResult);
      }
      setOfferings(offeringsResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [initialize, token, setSubscriptionStatus, setOfferings, setLoading, setError]);

  /**
   * Verify subscription with the backend after a purchase or restore.
   * The backend calls RevenueCat REST API to confirm and updates its database.
   */
  const syncWithBackend = useCallback(async () => {
    if (!token) return;

    try {
      const result = await verifySubscription(token);
      setSubscriptionStatus(result);

      // Reset quota store and invalidate cache to refresh the limits
      resetQuota();
      await queryClient.invalidateQueries({ queryKey: ['story-quota'] });
    } catch (err) {
      console.error('[useSubscription] Failed to verify with backend:', err);
    }
  }, [token, setSubscriptionStatus, queryClient, resetQuota]);

  const purchase = useCallback(async (): Promise<boolean> => {
    if (!monthlyPackage) {
      setError('Aucun plan disponible');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Purchase via RevenueCat SDK (must stay on device)
      await subscriptionService.purchasePackage(monthlyPackage);

      // Verify with backend (source of truth)
      await syncWithBackend();

      return useSubscriptionStore.getState().hasAccess;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'L\'achat a échoué';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [monthlyPackage, setLoading, setError, syncWithBackend]);

  const restore = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Restore via RevenueCat SDK (must stay on device)
      await subscriptionService.restorePurchases();

      // Verify with backend (source of truth)
      await syncWithBackend();

      return useSubscriptionStore.getState().hasAccess;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'La restauration a échoué';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, syncWithBackend]);

  const getFormattedPrice = useCallback((): string => {
    if (!monthlyPackage) return '';
    return monthlyPackage.product.priceString;
  }, [monthlyPackage]);

  const getFormattedExpirationDate = useCallback((): string | null => {
    if (!expirationDate) return null;
    return new Date(expirationDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [expirationDate]);

  /**
   * Ouvre la page de gestion d'abonnement (App Store ou Google Play)
   * pour permettre à l'utilisateur de résilier son abonnement
   */
  const openManageSubscription = useCallback(async (): Promise<void> => {
    const url = managementUrl
      ?? (Platform.OS === 'ios'
        ? process.env.EXPO_PUBLIC_IAP_IOS_FALLBACK_URL
        : process.env.EXPO_PUBLIC_IAP_ANDROID_FALLBACK_URL);

    if (!url) {
      setError('Impossible d\'ouvrir la page de gestion');
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('[useSubscription] Failed to open management URL:', err);
      setError('Impossible d\'ouvrir la page de gestion');
    }
  }, [managementUrl, setError]);

  // Initialize on mount if user is logged in
  useEffect(() => {
    if (user?.email) {
      initialize();
    }
  }, [user?.email, initialize]);

  return {
    // State
    status,
    isSubscribed,
    hasAccess,
    offerings,
    monthlyPackage,
    expirationDate,
    willRenew,
    isLoading,
    error,
    managementUrl,
    // Actions
    initialize,
    refresh,
    purchase,
    restore,
    reset,
    openManageSubscription,
    // Helpers
    getFormattedPrice,
    getFormattedExpirationDate,
  };
};

export default useSubscription;
