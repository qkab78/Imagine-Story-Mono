import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { Slot, useRouter, useSegments, } from 'expo-router';
import useAuthStore from '@/store/auth/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider } from 'tamagui'
import config from '@/tamagui.config';
import { ThemeProvider } from '@shopify/restyle';
import { theme, darkTheme } from '@/config/theme';

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
  const segments = useSegments();
  const router = useRouter();

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
