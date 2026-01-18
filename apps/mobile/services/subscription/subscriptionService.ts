import Purchases, {
  PurchasesError,
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { ENTITLEMENT_ID, SUBSCRIPTION_ERRORS } from '@/types/subscription';

const IOS_API_KEY = process.env.EXPO_PUBLIC_IAP_IOS_KEY || '';
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_IAP_ANDROID_KEY || '';

class SubscriptionService {
  private isConfigured = false;

  async initialize(userId?: string): Promise<void> {
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
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    } catch (error) {
      const purchaseError = error as PurchasesError;

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

  getMonthlyPackage(offering: PurchasesOffering | null): PurchasesPackage | null {
    if (!offering) return null;
    return offering.monthly || offering.availablePackages[0] || null;
  }

  isInitialized(): boolean {
    return this.isConfigured;
  }
}

export const subscriptionService = new SubscriptionService();
