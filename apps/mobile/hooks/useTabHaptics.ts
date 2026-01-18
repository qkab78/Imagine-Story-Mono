import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * useTabHaptics - Hook to trigger haptic feedback on tab changes
 *
 * Listens to route changes and triggers a selection haptic on iOS
 * when navigating between tabs.
 */
export const useTabHaptics = () => {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios' && previousPathname.current !== null && previousPathname.current !== pathname) {
      Haptics.selectionAsync();
    }
    previousPathname.current = pathname;
  }, [pathname]);
};

export default useTabHaptics;
