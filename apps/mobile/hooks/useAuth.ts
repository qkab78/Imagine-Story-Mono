import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { login as apiLogin, register as apiRegister, getGoogleRedirectUrl } from '@/api/auth';
import useAuthStore from '@/store/auth/authStore';

WebBrowser.maybeCompleteAuthSession();

export const useLogin = () => {
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiLogin({ email, password }),
    onSuccess: (data) => {
      if (!data.token) {
        throw new Error('Identifiants invalides');
      }
      setToken(data.token);
      setUser({
        id: data.user.id,
        fullname: `${data.user.firstname} ${data.user.lastname}`,
        email: data.user.email,
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        role: data.user.role,
        avatar: data.user.avatar,
        createdAt: data.user.createdAt,
      });
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      Alert.alert(
        'Erreur de connexion',
        error.message || 'Une erreur est survenue lors de la connexion'
      );
    },
  });
};

export const useRegister = () => {
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { fullname: string; email: string; password: string }) => {
      const [firstname, ...lastnameParts] = data.fullname.split(' ');
      const lastname = lastnameParts.join(' ');

      return apiRegister({
        email: data.email,
        password: data.password,
        firstname,
        lastname,
      });
    },
    onSuccess: (data) => {
      if (!data.token) {
        throw new Error("Erreur lors de la création du compte");
      }
      setToken(data.token);
      setUser(data.user);
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      Alert.alert(
        "Erreur d'inscription",
        error.message || "Une erreur est survenue lors de l'inscription"
      );
    },
  });
};

export const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Create the mobile callback URL (deep link)
      const mobileCallbackUrl = Linking.createURL('auth/google/callback');

      // 2. Get redirect URL from backend, passing our callback URL
      const { redirectUrl } = await getGoogleRedirectUrl(mobileCallbackUrl);

      // 3. Open browser for Google consent
      // The backend will redirect to mobileCallbackUrl with auth data
      // The callback screen (app/auth/google/callback.tsx) handles saving to store and redirecting
      await WebBrowser.openAuthSessionAsync(redirectUrl, mobileCallbackUrl);
    } catch (error) {
      Alert.alert(
        'Erreur de connexion',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion avec Google'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    signInWithGoogle,
    isLoading,
  };
};
