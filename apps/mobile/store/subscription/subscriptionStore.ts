import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import type { SubscriptionStatus, SubscriptionStore, ExpirationWarningLevel } from '@/types/subscription';
import { ENTITLEMENT_ID } from '@/types/subscription';
import { calculateDaysUntilExpiration } from '@/utils/date';

const getExpirationWarningLevel = (
  daysUntilExpiration: number | null,
  willRenew: boolean
): ExpirationWarningLevel => {
  // N'afficher l'avertissement que si l'utilisateur a annulé le renouvellement
  if (willRenew || daysUntilExpiration === null) return 'none';

  if (daysUntilExpiration <= 3) return 'urgent';
  if (daysUntilExpiration <= 7) return 'warning';
  if (daysUntilExpiration <= 30) return 'info';
  return 'none';
};

const storage = new MMKV({ id: 'subscription-storage' });

const getStatusFromCustomerInfo = (customerInfo: CustomerInfo | null): SubscriptionStatus => {
  if (!customerInfo) return 'free';

  // Vérifier d'abord les entitlements actifs
  const activeEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  if (activeEntitlement?.isActive) {
    return 'premium';
  }

  // Vérifier les entitlements expirés dans "all" (contient actifs ET expirés)
  const allEntitlement = customerInfo.entitlements.all[ENTITLEMENT_ID];
  if (allEntitlement) {
    // L'utilisateur avait un abonnement mais il n'est plus actif
    if (allEntitlement.expirationDate) {
      const expirationDate = new Date(allEntitlement.expirationDate);
      if (expirationDate < new Date()) {
        return 'expired';
      }
    }
    // Annulé mais pas encore expiré (willRenew = false mais date pas passée)
    if (!allEntitlement.willRenew) {
      return 'cancelled';
    }
  }

  return 'free';
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
  daysUntilExpiration: null,
  expirationWarningLevel: 'none',

  setCustomerInfo: (customerInfo: CustomerInfo | null) => {
    const status = getStatusFromCustomerInfo(customerInfo);
    const isSubscribed = status === 'premium';
    // Utiliser active en priorité, sinon all (pour les abonnements expirés)
    const entitlement = customerInfo?.entitlements.active[ENTITLEMENT_ID]
      || customerInfo?.entitlements.all[ENTITLEMENT_ID];

    const expirationDate = entitlement?.expirationDate || null;
    const willRenew = entitlement?.willRenew ?? false;
    const daysUntilExpiration = calculateDaysUntilExpiration(expirationDate);
    const expirationWarningLevel = getExpirationWarningLevel(daysUntilExpiration, willRenew);

    set({
      customerInfo,
      status,
      isSubscribed,
      expirationDate,
      willRenew,
      daysUntilExpiration,
      expirationWarningLevel,
    });

    // Persist subscription status for offline access
    storage.set('isSubscribed', isSubscribed);
    storage.set('status', status);
    if (expirationDate) {
      storage.set('expirationDate', expirationDate);
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
      daysUntilExpiration: null,
      expirationWarningLevel: 'none',
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
