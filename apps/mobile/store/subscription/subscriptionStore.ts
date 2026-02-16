import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import type { SubscriptionStatus, SubscriptionStore, SubscriptionStatusDTO } from '@/types/subscription';
import { ENTITLEMENT_ID } from '@/types/subscription';

const storage = new MMKV({ id: 'subscription-storage' });

const getMonthlyPackageFromOffering = (offering: PurchasesOffering | null): PurchasesPackage | null => {
  if (!offering) return null;
  return offering.monthly || offering.availablePackages[0] || null;
};

const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  status: 'free',
  isSubscribed: false,
  hasAccess: false,
  customerInfo: null,
  offerings: null,
  monthlyPackage: null,
  expirationDate: null,
  willRenew: false,
  isLoading: false,
  error: null,
  managementUrl: null,
  expiredModalDismissed: false,
  daysUntilExpiration: null,
  expirationWarningLevel: 'none',

  /**
   * Set subscription status from the backend DTO.
   * The backend is the source of truth for subscription state.
   */
  setSubscriptionStatus: (dto: SubscriptionStatusDTO) => {
    set({
      status: dto.status,
      isSubscribed: dto.isSubscribed,
      hasAccess: dto.hasAccess,
      expirationDate: dto.expirationDate,
      daysUntilExpiration: dto.daysUntilExpiration,
      expirationWarningLevel: dto.expirationWarningLevel,
      willRenew: dto.willRenew,
      managementUrl: dto.managementUrl,
    });

    // Persist subscription status for offline access
    storage.set('isSubscribed', dto.isSubscribed);
    storage.set('status', dto.status);
    if (dto.expirationDate) {
      storage.set('expirationDate', dto.expirationDate);
    }
  },

  /**
   * @deprecated Use setSubscriptionStatus() with the backend DTO instead.
   * Kept for backward compatibility during transition.
   */
  setCustomerInfo: (customerInfo: CustomerInfo | null) => {
    set({ customerInfo });
  },

  setOfferings: (offerings: PurchasesOffering | null) => {
    const monthlyPackage = getMonthlyPackageFromOffering(offerings);
    set({ offerings, monthlyPackage });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),

  setExpiredModalDismissed: (dismissed: boolean) => set({ expiredModalDismissed: dismissed }),

  reset: () => {
    storage.delete('isSubscribed');
    storage.delete('status');
    storage.delete('expirationDate');

    set({
      status: 'free',
      isSubscribed: false,
      hasAccess: false,
      customerInfo: null,
      offerings: null,
      monthlyPackage: null,
      expirationDate: null,
      willRenew: false,
      isLoading: false,
      error: null,
      managementUrl: null,
      expiredModalDismissed: false,
      daysUntilExpiration: null,
      expirationWarningLevel: 'none',
    });
  },
}));

// Load cached subscription status on store initialization (client-side only)
if (typeof window !== 'undefined') {
  try {
    const cachedStatus = storage.getString('status') as SubscriptionStatus | undefined;
    const cachedIsSubscribed = storage.getBoolean('isSubscribed');
    const cachedExpirationDate = storage.getString('expirationDate');

    if (cachedStatus && cachedIsSubscribed !== undefined) {
      useSubscriptionStore.setState({
        status: cachedStatus,
        isSubscribed: cachedIsSubscribed,
        expirationDate: cachedExpirationDate || null,
      });
    }
  } catch {
    // MMKV not available (SSR or web)
  }
}

export default useSubscriptionStore;
