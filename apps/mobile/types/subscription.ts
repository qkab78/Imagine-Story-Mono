import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

export type SubscriptionStatus = 'free' | 'premium' | 'expired' | 'cancelled';

export interface SubscriptionState {
  status: SubscriptionStatus;
  isSubscribed: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  monthlyPackage: PurchasesPackage | null;
  expirationDate: string | null;
  willRenew: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SubscriptionStore extends SubscriptionState {
  setCustomerInfo: (customerInfo: CustomerInfo | null) => void;
  setOfferings: (offerings: PurchasesOffering | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const ENTITLEMENT_ID = 'Mon Petit Conteur Premium';

export const SUBSCRIPTION_ERRORS = {
  PURCHASE_CANCELLED: 'Achat annulé',
  PURCHASE_FAILED: 'L\'achat a échoué. Veuillez réessayer.',
  RESTORE_FAILED: 'Impossible de restaurer les achats. Veuillez réessayer.',
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  NOT_CONFIGURED: 'Service d\'achat non configuré.',
} as const;
