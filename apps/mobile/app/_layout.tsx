import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { Stack } from 'expo-router';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider } from 'tamagui'
import config from '@/tamagui.config';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '@/config/theme';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubscriptionExpiredModal } from '@/components/organisms/subscription';
import { SubscriptionSheet } from '@/components/organisms/profile/SubscriptionSheet';
import { ExpirationWarningBanner } from '@/components/molecules/subscription';
import { EmailVerificationBanner } from '@/components/molecules/auth/EmailVerificationBanner';
import { useSubscriptionExpiredModal } from '@/hooks/useSubscriptionExpiredModal';
import { useSubscriptionSheet } from '@/hooks/useSubscriptionSheet';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { useEmailVerificationBanner } from '@/hooks/useEmailVerificationBanner';
import { useSubscriptionInit } from '@/hooks/useSubscriptionInit';
import { useUserSync } from '@/hooks/useUserSync';

// Internationalisation
import '@/locales';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales';

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * AppContent - Composant enfant qui utilise les hooks dépendant de QueryClient
 * Doit être rendu à l'intérieur du QueryClientProvider
 */
function AppContent() {
  const insets = useSafeAreaInsets();

  // Navigation basée sur l'authentification
  useAuthNavigation();

  // Synchronisation des données utilisateur avec le backend
  useUserSync();

  // Initialisation du service d'abonnement
  useSubscriptionInit();

  // Bannière de vérification email
  const emailBanner = useEmailVerificationBanner();

  // Bannière d'expiration d'abonnement
  const [expirationBannerDismissed, setExpirationBannerDismissed] = useState(false);
  const daysUntilExpiration = useSubscriptionStore(state => state.daysUntilExpiration);
  const expirationWarningLevel = useSubscriptionStore(state => state.expirationWarningLevel);

  // Modals et sheets d'abonnement
  const expiredModal = useSubscriptionExpiredModal();
  const subscriptionSheet = useSubscriptionSheet();

  const handleRenew = () => {
    expiredModal.dismissModal();
    subscriptionSheet.open();
  };

  const shouldShowExpirationBanner =
    expirationWarningLevel !== 'none' &&
    daysUntilExpiration !== null &&
    !expirationBannerDismissed &&
    !emailBanner.shouldShow;

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

      <SubscriptionExpiredModal
        visible={expiredModal.showModal}
        onClose={expiredModal.dismissModal}
        onRenew={handleRenew}
        expirationDate={expiredModal.expirationDate}
        status={expiredModal.status}
      />

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

      {emailBanner.shouldShow && (
        <View style={[styles.bannerContainer, { paddingTop: insets.top }]}>
          <EmailVerificationBanner
            onResendPress={emailBanner.handleResend}
            onDismiss={emailBanner.handleDismiss}
            isResending={emailBanner.isResending}
          />
        </View>
      )}

      {shouldShowExpirationBanner && (
        <View style={[styles.bannerContainer, { paddingTop: insets.top }]}>
          <ExpirationWarningBanner
            daysUntilExpiration={daysUntilExpiration}
            level={expirationWarningLevel}
            onRenewPress={subscriptionSheet.open}
            onDismiss={() => setExpirationBannerDismissed(true)}
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
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <TamaguiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <AppContent />
          </QueryClientProvider>
        </TamaguiProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
