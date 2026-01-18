import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Slot, useRouter, useSegments, } from 'expo-router';
import useAuthStore from '@/store/auth/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider } from 'tamagui'
import config from '@/tamagui.config';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '@/config/theme';
import { subscriptionService } from '@/services/subscription';

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [darkMode, setDarkMode] = useState(false);
  const [loaded] = useFonts({
    SpaceMonoRegular: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SpaceMonoBold: require('../assets/fonts/SpaceMono-Bold.ttf'),
    SpaceMonoItalic: require('../assets/fonts/SpaceMono-Italic.ttf'),
    SpaceMonoBoldItalic: require('../assets/fonts/SpaceMono-BoldItalic.ttf'),
  });
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const segments = useSegments();
  const router = useRouter();

  // Initialize RevenueCat subscription service
  useEffect(() => {
    const initSubscription = async () => {
      try {
        await subscriptionService.initialize(user?.email);
      } catch (error) {
        console.error('[RootLayout] Failed to initialize subscription service:', error);
      }
    };

    initSubscription();
  }, [user?.email]);

  useEffect(() => {
    const isAuthGroup = segments[0] === '(protected)' || segments[0] === '(tabs)';
    if (!token && isAuthGroup) {
      console.log('No token found, redirecting to login');
      router.replace('/');
    } else if (token) {
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
          <Slot />
          <StatusBar style="dark" backgroundColor="#F0E6FF" />
        </QueryClientProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}
