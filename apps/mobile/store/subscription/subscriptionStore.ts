import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import type { SubscriptionStatus, SubscriptionStore } from '@/types/subscription';
import { ENTITLEMENT_ID } from '@/types/subscription';

const storage = new MMKV({ id: 'subscription-storage' });

const getStatusFromCustomerInfo = (customerInfo: CustomerInfo | null): SubscriptionStatus => {
  if (!customerInfo) return 'free';

  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  if (!entitlement) return 'free';

  if (entitlement.isActive) {
    return 'premium';
  }

  if (entitlement.expirationDate) {
    const expirationDate = new Date(entitlement.expirationDate);
    if (expirationDate < new Date()) {
      return 'expired';
    }
  }

  return 'cancelled';
};

const getMonthlyPackageFromOffering = (offering: PurchasesOffering | null): PurchasesPackage | null => {
  if (!offering) return null;
  return offering.monthly || offering.availablePackages[0] || null;
};

const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  status: 'free',
  isSubscribed: false,
  customerInfo: null,
  offerings: null,
  monthlyPackage: null,
  expirationDate: null,
  willRenew: false,
  isLoading: false,
  error: null,
  expiredModalDismissed: false,

  setCustomerInfo: (customerInfo: CustomerInfo | null) => {
    const status = getStatusFromCustomerInfo(customerInfo);
    const isSubscribed = status === 'premium';
    const entitlement = customerInfo?.entitlements.active[ENTITLEMENT_ID];

    set({
      customerInfo,
      status,
      isSubscribed,
      expirationDate: entitlement?.expirationDate || null,
      willRenew: entitlement?.willRenew ?? false,
    });

    // Persist subscription status for offline access
    storage.set('isSubscribed', isSubscribed);
    storage.set('status', status);
    if (entitlement?.expirationDate) {
      storage.set('expirationDate', entitlement.expirationDate);
    }
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
      customerInfo: null,
      offerings: null,
      monthlyPackage: null,
      expirationDate: null,
      willRenew: false,
      isLoading: false,
      error: null,
      expiredModalDismissed: false,
    });
  },
}));

// Load cached subscription status on store initialization
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

export default useSubscriptionStore;
