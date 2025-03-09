import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack, useRouter, useSegments } from 'expo-router';
import useAuthStore from '@/store/auth/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTamagui,TamaguiProvider, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4' // for quick config install this

const config = createTamagui(defaultConfig)
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(protected)" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="(protected)/home" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)/stories" /> */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/stories" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
      // router.replace('/(protected)/home');
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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <StackLayout />
        <StatusBar style="auto" />
      </QueryClientProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}
