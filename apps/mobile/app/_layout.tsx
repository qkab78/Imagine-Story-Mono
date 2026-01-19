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
    const isStoriesGroup = segments[0] === 'stories';
    const isAlreadyInAuthenticatedArea = isAuthGroup || isStoriesGroup;

    if (!token && isAlreadyInAuthenticatedArea) {
      console.log('No token found, redirecting to login');
      router.replace('/');
    } else if (token && !isAlreadyInAuthenticatedArea) {
      // Only redirect to tabs if the user is not already in an authenticated area
      // This prevents resetting the navigation stack when navigating within the app
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
          <StatusBar style="dark" backgroundColor="#F0E6FF" />
        </QueryClientProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}
