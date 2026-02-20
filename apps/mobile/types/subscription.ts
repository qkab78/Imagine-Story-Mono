import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

export type SubscriptionStatus = 'free' | 'premium' | 'expired' | 'cancelled' | 'billing_issue';

export type ExpirationWarningLevel = 'none' | 'info' | 'warning' | 'urgent';

/**
 * DTO returned by the backend API (GET /subscription/status, POST /subscription/verify).
 * The backend is the source of truth for subscription state.
 */
export interface SubscriptionStatusDTO {
  status: SubscriptionStatus;
  isSubscribed: boolean;
  hasAccess: boolean;
  expirationDate: string | null;
  daysUntilExpiration: number | null;
  expirationWarningLevel: ExpirationWarningLevel;
  willRenew: boolean;
  productId: string | null;
  store: string | null;
  managementUrl: string | null;
}

export interface SubscriptionState {
  status: SubscriptionStatus;
  isSubscribed: boolean;
  hasAccess: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  monthlyPackage: PurchasesPackage | null;
  expirationDate: string | null;
  willRenew: boolean;
  isLoading: boolean;
  error: string | null;
  managementUrl: string | null;
  // Expiration warning
  daysUntilExpiration: number | null;
  expirationWarningLevel: ExpirationWarningLevel;
}

export interface SubscriptionStore extends SubscriptionState {
  setSubscriptionStatus: (dto: SubscriptionStatusDTO) => void;
  setCustomerInfo: (customerInfo: CustomerInfo | null) => void;
  setOfferings: (offerings: PurchasesOffering | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  // Expired modal state (session only, not persisted)
  expiredModalDismissed: boolean;
  setExpiredModalDismissed: (dismissed: boolean) => void;
}

export const ENTITLEMENT_ID = 'Mon Petit Conteur Premium';
export const OFFERING_ID = 'MPC Premium';

export const SUBSCRIPTION_ERRORS = {
  PURCHASE_CANCELLED: 'Achat annulé',
  PURCHASE_FAILED: 'L\'achat a échoué. Veuillez réessayer.',
  RESTORE_FAILED: 'Impossible de restaurer les achats. Veuillez réessayer.',
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  NOT_CONFIGURED: 'Service d\'achat non configuré.',
} as const;
