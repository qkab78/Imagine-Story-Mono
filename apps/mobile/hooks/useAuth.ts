import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { login as apiLogin, register as apiRegister, getGoogleRedirectUrl, type GoogleAuthResponse } from '@/api/auth';
import useAuthStore from '@/store/auth/authStore';
import { transformApiUserToAuthUser } from '@/utils/userTransform';

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
      setUser(transformApiUserToAuthUser(data.user));
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
      setUser(transformApiUserToAuthUser(data.user));
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
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Create the mobile callback URL (deep link)
      const mobileCallbackUrl = Linking.createURL('auth/google/callback');

      // 2. Get redirect URL from backend, passing our callback URL
      const { redirectUrl } = await getGoogleRedirectUrl(mobileCallbackUrl);

      // 3. Open browser for Google consent
      const result = await WebBrowser.openAuthSessionAsync(redirectUrl, mobileCallbackUrl);

      // 4. Handle the result
      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const encodedData = url.searchParams.get('data');

        if (encodedData) {
          const authData: GoogleAuthResponse = JSON.parse(decodeURIComponent(encodedData));

          setToken(authData.token);
          setUser(transformApiUserToAuthUser(authData.user));

          if (authData.isNewUser) {
            Alert.alert('Bienvenue !', 'Votre compte a été créé avec succès.');
          }

          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      Alert.alert(
        'Erreur de connexion',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion avec Google'
      );
    } finally {
      setIsLoading(false);
    }
  }, [setToken, setUser, router]);

  return {
    signInWithGoogle,
    isLoading,
  };
};
