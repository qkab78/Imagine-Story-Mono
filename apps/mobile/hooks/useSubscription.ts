import { useCallback, useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import useAuthStore from '@/store/auth/authStore';
import useQuotaStore from '@/store/quota/quotaStore';
import { subscriptionService } from '@/services/subscription';
import { syncSubscriptionToBackend } from '@/api/subscription';
import { OFFERING_ID } from '@/types/subscription';

export const useSubscription = () => {
  const queryClient = useQueryClient();
  const { token, user, setUser } = useAuthStore();
  const { reset: resetQuota } = useQuotaStore();
  const {
    status,
    isSubscribed,
    customerInfo,
    offerings,
    monthlyPackage,
    expirationDate,
    willRenew,
    isLoading,
    error,
    setCustomerInfo,
    setOfferings,
    setLoading,
    setError,
    reset,
  } = useSubscriptionStore();

  const initialize = useCallback(async () => {
    if (!subscriptionService.isInitialized()) {
      try {
        await subscriptionService.initialize(user?.id);
      } catch (err) {
        console.error('[useSubscription] Failed to initialize:', err);
      }
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    if (!subscriptionService.isInitialized()) {
      await initialize();
    }

    setLoading(true);
    setError(null);

    try {
      const [customerInfoResult, offeringsResult] = await Promise.all([
        subscriptionService.getCustomerInfo(),
        subscriptionService.getOfferings(OFFERING_ID),
      ]);

      setCustomerInfo(customerInfoResult);
      setOfferings(offeringsResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [initialize, setCustomerInfo, setOfferings, setLoading, setError]);

  const syncWithBackend = useCallback(async (isPremium: boolean) => {
    if (!token) return;

    try {
      const result = await syncSubscriptionToBackend(token, isPremium);
      if (result.user && user) {
        setUser({
          ...user,
          role: result.user.role,
        });
        
        // Reset quota store and invalidate cache to refresh the limits
        resetQuota();
        await queryClient.invalidateQueries({ queryKey: ['story-quota'] });
      }
    } catch (err) {
      console.error('[useSubscription] Failed to sync with backend:', err);
    }
  }, [token, user, setUser, queryClient, resetQuota]);

  const purchase = useCallback(async (): Promise<boolean> => {
    if (!monthlyPackage) {
      setError('Aucun plan disponible');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const customerInfoResult = await subscriptionService.purchasePackage(monthlyPackage);
      setCustomerInfo(customerInfoResult);

      const isPremium = subscriptionService.checkEntitlement(customerInfoResult);
      if (isPremium) {
        await syncWithBackend(true);
      }

      return isPremium;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'L\'achat a échoué';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [monthlyPackage, setCustomerInfo, setLoading, setError, syncWithBackend]);

  const restore = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const customerInfoResult = await subscriptionService.restorePurchases();
      setCustomerInfo(customerInfoResult);

      const isPremium = subscriptionService.checkEntitlement(customerInfoResult);
      if (isPremium) {
        await syncWithBackend(true);
      }

      return isPremium;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'La restauration a échoué';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setCustomerInfo, setLoading, setError, syncWithBackend]);

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
    const managementURL = customerInfo
      ? subscriptionService.getManagementURL(customerInfo)
      : null;

    const url = managementURL
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
  }, [customerInfo, setError]);

  // Initialize on mount if user is logged in
  useEffect(() => {
    if (user?.id) {
      initialize();
    }
  }, [user?.id, initialize]);

  return {
    // State
    status,
    isSubscribed,
    customerInfo,
    offerings,
    monthlyPackage,
    expirationDate,
    willRenew,
    isLoading,
    error,
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
