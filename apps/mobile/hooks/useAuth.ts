import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { login as apiLogin, register as apiRegister } from '@/api/auth';
import useAuthStore from '@/store/auth/authStore';

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
      setUser(data.user);
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

  return useMutation({
    mutationFn: async () => {
      // TODO: Implement Google Sign-In which will be handled by the backend
      // For now, we just show an alert
      throw new Error('NOT_IMPLEMENTED');
    },
    onSuccess: (data: any) => {
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        router.replace('/(tabs)');
      }
    },
    onError: (error: any) => {
      if (error.message === 'NOT_IMPLEMENTED') {
        Alert.alert(
          'Bientôt disponible',
          'La connexion avec Google sera bientôt disponible ! 🚀'
        );
      } else {
        Alert.alert(
          'Erreur de connexion',
          error.message || 'Une erreur est survenue lors de la connexion avec Google'
        );
      }
    },
  });
};
