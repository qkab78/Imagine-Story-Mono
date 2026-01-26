import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Stack, useRouter, useSegments } from 'expo-router';
import useAuthStore from '@/store/auth/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider } from 'tamagui'
import config from '@/tamagui.config';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '@/config/theme';
import { Alert } from 'react-native';
import { subscriptionService } from '@/services/subscription';
import { SubscriptionExpiredModal } from '@/components/organisms/subscription';
import { SubscriptionSheet } from '@/components/organisms/profile/SubscriptionSheet';
import { useSubscriptionExpiredModal } from '@/hooks/useSubscriptionExpiredModal';
import { useSubscription } from '@/hooks/useSubscription';

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * AppContent - Composant enfant qui utilise les hooks dépendant de QueryClient
 * Doit être rendu à l'intérieur du QueryClientProvider
 */
function AppContent() {
  const user = useAuthStore(state => state.user);

  // Subscription expired modal
  const {
    showModal: showExpiredModal,
    showSubscriptionSheet,
    dismissModal,
    handleRenew,
    closeSubscriptionSheet,
    expirationDate,
    status,
  } = useSubscriptionExpiredModal();

  // Subscription actions for SubscriptionSheet
  const {
    isSubscribed,
    isLoading: isSubscriptionLoading,
    willRenew,
    getFormattedPrice,
    getFormattedExpirationDate,
    purchase,
    restore,
    openManageSubscription,
  } = useSubscription();

  const handlePurchase = async () => {
    const success = await purchase();
    if (success) {
      Alert.alert('Succès', 'Bienvenue dans la famille Premium !');
      closeSubscriptionSheet();
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    if (success) {
      Alert.alert('Succès', 'Vos achats ont été restaurés.');
      closeSubscriptionSheet();
    } else {
      Alert.alert('Information', 'Aucun achat précédent trouvé.');
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Gérer l\'abonnement',
      'Vous allez être redirigé vers les paramètres de votre store.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => openManageSubscription() },
      ]
    );
  };

  // Initialize RevenueCat subscription service
  useEffect(() => {
    const initSubscription = async () => {
      try {
        await subscriptionService.initialize(user?.email);
      } catch (error) {
        console.error('[AppContent] Failed to initialize subscription service:', error);
      }
    };

    initSubscription();
  }, [user?.email]);

  return (
    <>
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

      {/* Subscription sheet for renewal */}
      <SubscriptionSheet
        visible={showSubscriptionSheet}
        onClose={closeSubscriptionSheet}
        isPremium={isSubscribed}
        price={getFormattedPrice()}
        nextPaymentDate={getFormattedExpirationDate() ?? undefined}
        willRenew={willRenew}
        isLoading={isSubscriptionLoading}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onCancel={handleCancelSubscription}
      />

      <StatusBar style="dark" backgroundColor="#F0E6FF" />
    </>
  );
}

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
