import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import useAuthStore from '@/store/auth/authStore';

/**
 * Hook qui gère la navigation basée sur l'état d'authentification.
 * Redirige automatiquement l'utilisateur vers la page appropriée.
 */
export function useAuthNavigation() {
  const token = useAuthStore(state => state.token);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isInProtectedArea = ['(tabs)', 'stories'].includes(segments[0]);
    const isAuthenticated = !!token;

    const shouldRedirectToLogin = !isAuthenticated && isInProtectedArea;
    const shouldRedirectToHome = isAuthenticated && !isInProtectedArea;

    if (shouldRedirectToLogin) {
      router.replace('/');
      return;
    }

    if (shouldRedirectToHome) {
      router.replace('/(tabs)');
    }
  }, [token, segments, router]);
}
