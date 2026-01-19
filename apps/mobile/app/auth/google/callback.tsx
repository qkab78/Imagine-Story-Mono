import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useAuthStore from '@/store/auth/authStore';
import type { GoogleAuthResponse } from '@/api/auth';

/**
 * This screen handles the OAuth callback from Google.
 * It receives the auth data via deep link query params,
 * saves them to the store, and redirects to the home screen.
 */
export default function GoogleCallbackScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    if (data) {
      try {
        const authData: GoogleAuthResponse = JSON.parse(decodeURIComponent(data));

        setToken(authData.token);
        setUser({
          id: authData.user.id,
          fullname: `${authData.user.firstname} ${authData.user.lastname}`,
          email: authData.user.email,
          firstname: authData.user.firstname,
          lastname: authData.user.lastname,
          role: authData.user.role,
          avatar: authData.user.avatar,
          createdAt: authData.user.createdAt,
        });

        router.replace('/(tabs)');
      } catch (error) {
        console.error('Failed to parse Google auth callback data:', error);
        router.replace('/login');
      }
    }
  }, [data, setToken, setUser, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
});
