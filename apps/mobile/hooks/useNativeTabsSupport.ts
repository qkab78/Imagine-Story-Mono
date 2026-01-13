import { Platform } from 'react-native';
import * as Device from 'expo-device';

/**
 * useNativeTabsSupport - Hook to detect NativeTabs support
 *
 * NativeTabs are available on iOS with Expo SDK 54+
 * Android has Material Design constraints (max 5 tabs)
 */
export const useNativeTabsSupport = () => {
  // NativeTabs available on iOS (requires SDK 54+)
  const hasNativeTabsSupport = Platform.OS === 'ios';

  // Android supports max 5 tabs (Material Design constraint)
  const isAndroid = Platform.OS === 'android';
  const maxTabs = isAndroid ? 5 : 6;

  // Check if device is iOS 26+ for advanced features
  const iosVersion = Platform.OS === 'ios' ? parseInt(Device.osVersion?.split('.')[0] || '0', 10) : 0;
  const hasAdvancedFeatures = Platform.OS === 'ios' && iosVersion >= 26;

  return {
    hasNativeTabsSupport,
    isAndroid,
    maxTabs,
    shouldUseNativeTabs: hasNativeTabsSupport,
    hasAdvancedFeatures, // role="search", minimizeBehavior, etc.
  };
};

export default useNativeTabsSupport;
