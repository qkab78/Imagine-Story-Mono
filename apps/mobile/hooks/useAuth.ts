import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { login as apiLogin, register as apiRegister, getGoogleRedirectUrl, getGoogleCallbackUrl, type GoogleAuthResponse } from '@/api/auth';
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
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Get redirect URL from backend
      const { redirectUrl } = await getGoogleRedirectUrl();

      // 2. Open browser for Google consent
      const result = await WebBrowser.openAuthSessionAsync(
        redirectUrl,
        getGoogleCallbackUrl()
      );

      if (result.type === 'success' && result.url) {
        // 3. Parse the response from the callback URL
        // The backend returns the auth data as JSON in the response
        const url = new URL(result.url);
        const responseData = url.searchParams.get('data');

        if (responseData) {
          const data: GoogleAuthResponse = JSON.parse(decodeURIComponent(responseData));

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

          if (data.isNewUser) {
            Alert.alert('Bienvenue !', 'Votre compte a été créé avec succès.');
          }

          router.replace('/(tabs)');
        }
      } else if (result.type === 'cancel') {
        // User cancelled - do nothing
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
