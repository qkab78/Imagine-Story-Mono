import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { Stack, useRouter, useSegments } from 'expo-router';
import useAuthStore from '@/store/auth/authStore';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider } from 'tamagui'
import config from '@/tamagui.config';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '@/config/theme';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { subscriptionService } from '@/services/subscription';
import { SubscriptionExpiredModal } from '@/components/organisms/subscription';
import { SubscriptionSheet } from '@/components/organisms/profile/SubscriptionSheet';
import { ExpirationWarningBanner } from '@/components/molecules/subscription';
import { useSubscriptionExpiredModal } from '@/hooks/useSubscriptionExpiredModal';
import { useSubscriptionSheet } from '@/hooks/useSubscriptionSheet';

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * AppContent - Composant enfant qui utilise les hooks dépendant de QueryClient
 * Doit être rendu à l'intérieur du QueryClientProvider
 */
function AppContent() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const daysUntilExpiration = useSubscriptionStore(state => state.daysUntilExpiration);
  const expirationWarningLevel = useSubscriptionStore(state => state.expirationWarningLevel);

  // État pour le dismiss de la bannière d'expiration
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Subscription expired modal hook
  const {
    showModal: showExpiredModal,
    dismissModal,
    expirationDate,
    status,
  } = useSubscriptionExpiredModal();

  // Subscription sheet hook
  const subscriptionSheet = useSubscriptionSheet();

  // Handler pour le bouton "Renouveler" de la modal expirée
  const handleRenew = () => {
    dismissModal();
    subscriptionSheet.open();
  };

  const setCustomerInfo = useSubscriptionStore(state => state.setCustomerInfo);

  // Initialize RevenueCat subscription service and fetch customer info
  // Note: RevenueCat uses email as app_user_id
  useEffect(() => {
    const initSubscription = async () => {
      try {
        await subscriptionService.initialize(user?.email);

        // Fetch and update customer info after initialization
        if (subscriptionService.isInitialized()) {
          const customerInfo = await subscriptionService.getCustomerInfo();
          setCustomerInfo(customerInfo);
        }
      } catch (error) {
        console.error('[AppContent] Failed to initialize subscription service:', error);
      }
    };

    if (user?.email) {
      initSubscription();
    }
  }, [user?.email, setCustomerInfo]);

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="stories" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(protected)" />
        <Stack.Screen name="notification-permission" />
      </Stack>

      {/* Subscription expired modal */}
      <SubscriptionExpiredModal
        visible={showExpiredModal}
        onClose={dismissModal}
        onRenew={handleRenew}
        expirationDate={expirationDate}
        status={status}
      />

      {/* Subscription sheet for renewal (unified) */}
      <SubscriptionSheet
        visible={subscriptionSheet.visible}
        onClose={subscriptionSheet.close}
        isPremium={subscriptionSheet.isSubscribed}
        price={subscriptionSheet.price}
        nextPaymentDate={subscriptionSheet.nextPaymentDate}
        willRenew={subscriptionSheet.willRenew}
        isLoading={subscriptionSheet.isLoading}
        onPurchase={subscriptionSheet.handlePurchase}
        onRestore={subscriptionSheet.handleRestore}
        onCancel={subscriptionSheet.handleCancel}
      />

      <StatusBar style="dark" backgroundColor="#F0E6FF" />

      {/* Expiration warning banner - positioned absolutely to overlay content */}
      {expirationWarningLevel !== 'none' && daysUntilExpiration !== null && !bannerDismissed && (
        <View style={[styles.bannerContainer, { paddingTop: insets.top }]}>
          <ExpirationWarningBanner
            daysUntilExpiration={daysUntilExpiration}
            level={expirationWarningLevel}
            onRenewPress={subscriptionSheet.open}
            onDismiss={() => setBannerDismissed(true)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMonoRegular: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SpaceMonoBold: require('../assets/fonts/SpaceMono-Bold.ttf'),
    SpaceMonoItalic: require('../assets/fonts/SpaceMono-Italic.ttf'),
    SpaceMonoBoldItalic: require('../assets/fonts/SpaceMono-BoldItalic.ttf'),
  });
  const token = useAuthStore(state => state.token);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isAuthGroup = segments[0] === '(protected)' || segments[0] === '(tabs)';
    const isStoriesGroup = segments[0] === 'stories';
    const isAlreadyInAuthenticatedArea = isAuthGroup || isStoriesGroup;

    if (!token && isAlreadyInAuthenticatedArea) {
      console.log('No token found, redirecting to login');
      router.replace('/');
    } else if (token && !isAlreadyInAuthenticatedArea) {
      console.log('Token found, redirecting to home');
      router.replace('/(tabs)');
    }

  }, [token]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <TamaguiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}
