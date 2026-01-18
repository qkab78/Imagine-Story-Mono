import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform, NativeModules } from 'react-native';
import { ENTITLEMENT_ID, SUBSCRIPTION_ERRORS } from '@/types/subscription';

const IOS_API_KEY = process.env.EXPO_PUBLIC_IAP_IOS_KEY || '';
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_IAP_ANDROID_KEY || '';

/**
 * Vérifie si le module natif RevenueCat est disponible
 * (non disponible dans Expo Go, uniquement dans les dev builds ou production)
 */
const isNativeModuleAvailable = (): boolean => {
  return !!NativeModules.RNPurchases;
};

/**
 * Lazy import de RevenueCat pour éviter l'erreur NativeEventEmitter
 * lors du chargement initial de l'app
 */
const getPurchases = async () => {
  if (!isNativeModuleAvailable()) {
    throw new Error('RevenueCat native module is not available. Use a development build instead of Expo Go.');
  }
  const { default: Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } = await import('react-native-purchases');
  return { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE };
};

class SubscriptionService {
  private isConfigured = false;
  private isNativeAvailable = false;

  async initialize(userId?: string): Promise<void> {
    // Vérifier si le module natif est disponible
    if (!isNativeModuleAvailable()) {
      console.warn('[SubscriptionService] Native module not available (Expo Go?). Subscription features disabled.');
      return;
    }

    this.isNativeAvailable = true;

    if (this.isConfigured) {
      if (userId) {
        await this.login(userId);
      }
      return;
    }

    const apiKey = Platform.OS === 'ios' ? IOS_API_KEY : ANDROID_API_KEY;

    if (!apiKey) {
      console.warn('[SubscriptionService] No API key configured for', Platform.OS);
      return;
    }

    try {
      const { Purchases, LOG_LEVEL } = await getPurchases();
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      Purchases.configure({ apiKey });
      this.isConfigured = true;

      if (userId) {
        await this.login(userId);
      }
    } catch (error) {
      console.error('[SubscriptionService] Failed to initialize:', error);
      throw error;
    }
  }

  async login(userId: string): Promise<CustomerInfo> {
    if (!this.isConfigured) {
      throw new Error(SUBSCRIPTION_ERRORS.NOT_CONFIGURED);
    }

    try {
      const { Purchases } = await getPurchases();
      const { customerInfo } = await Purchases.logIn(userId);
      return customerInfo;
    } catch (error) {
      console.error('[SubscriptionService] Failed to login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (!this.isConfigured) return;

    try {
      const { Purchases } = await getPurchases();
      await Purchases.logOut();
    } catch (error) {
      console.error('[SubscriptionService] Failed to logout:', error);
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!this.isConfigured) {
      throw new Error(SUBSCRIPTION_ERRORS.NOT_CONFIGURED);
    }

    try {
      const { Purchases } = await getPurchases();
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('[SubscriptionService] Failed to get customer info:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<PurchasesOffering | null> {
    if (!this.isConfigured) {
      throw new Error(SUBSCRIPTION_ERRORS.NOT_CONFIGURED);
    }

    try {
      const { Purchases } = await getPurchases();
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('[SubscriptionService] Failed to get offerings:', error);
      throw error;
    }
  }

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
    if (!this.isConfigured) {
      throw new Error(SUBSCRIPTION_ERRORS.NOT_CONFIGURED);
    }

    try {
      const { Purchases } = await getPurchases();
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    } catch (error) {
      const { PURCHASES_ERROR_CODE } = await getPurchases();
      const purchaseError = error as { code?: typeof PURCHASES_ERROR_CODE[keyof typeof PURCHASES_ERROR_CODE] };

      if (purchaseError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        throw new Error(SUBSCRIPTION_ERRORS.PURCHASE_CANCELLED);
      }

      console.error('[SubscriptionService] Purchase failed:', error);
      throw new Error(SUBSCRIPTION_ERRORS.PURCHASE_FAILED);
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    if (!this.isConfigured) {
      throw new Error(SUBSCRIPTION_ERRORS.NOT_CONFIGURED);
    }

    try {
      const { Purchases } = await getPurchases();
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('[SubscriptionService] Failed to restore purchases:', error);
      throw new Error(SUBSCRIPTION_ERRORS.RESTORE_FAILED);
    }
  }

  checkEntitlement(customerInfo: CustomerInfo): boolean {
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  }

  getExpirationDate(customerInfo: CustomerInfo): string | null {
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    return entitlement?.expirationDate || null;
  }

  getWillRenew(customerInfo: CustomerInfo): boolean {
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    return entitlement?.willRenew ?? false;
  }

  /**
   * Retourne l'URL de gestion d'abonnement (App Store ou Google Play)
   * Permet à l'utilisateur de résilier son abonnement via la plateforme appropriée
   */
  getManagementURL(customerInfo: CustomerInfo): string | null {
    return customerInfo.managementURL;
  }

  getMonthlyPackage(offering: PurchasesOffering | null): PurchasesPackage | null {
    if (!offering) return null;
    return offering.monthly || offering.availablePackages[0] || null;
  }

  isInitialized(): boolean {
    return this.isConfigured;
  }

  isAvailable(): boolean {
    return this.isNativeAvailable;
  }
}

export const subscriptionService = new SubscriptionService();
