import { useCallback, useEffect } from 'react';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import useAuthStore from '@/store/auth/authStore';
import { subscriptionService } from '@/services/subscription';
import { syncSubscriptionToBackend } from '@/api/subscription';

export const useSubscription = () => {
  const { token, user, setUser } = useAuthStore();
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
        await subscriptionService.initialize(user?.email);
      } catch (err) {
        console.error('[useSubscription] Failed to initialize:', err);
      }
    }
  }, [user?.email]);

  const refresh = useCallback(async () => {
    if (!subscriptionService.isInitialized()) {
      await initialize();
    }

    setLoading(true);
    setError(null);

    try {
      const [customerInfoResult, offeringsResult] = await Promise.all([
        subscriptionService.getCustomerInfo(),
        subscriptionService.getOfferings(),
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
      }
    } catch (err) {
      console.error('[useSubscription] Failed to sync with backend:', err);
    }
  }, [token, user, setUser]);

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
    // Helpers
    getFormattedPrice,
    getFormattedExpirationDate,
  };
};

export default useSubscription;
