import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import { MMKV } from 'react-native-mmkv';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import useSubscriptionStore from '@/store/subscription/subscriptionStore';
import useQuotaStore from '@/store/quota/quotaStore';
import { subscriptionService } from '@/services/subscription';
import { logout } from '@/api/auth';
import { PROFILE_EXTERNAL_URLS } from '@/constants/profile';
import { router } from 'expo-router';

const storage = new MMKV({ id: 'profile-settings' });

export const useProfileSettings = () => {
  const { token, user, setToken, setUser } = useAuthStore();
  const resetSubscription = useSubscriptionStore((state) => state.reset);
  const resetQuota = useQuotaStore((state) => state.reset);
  const queryClient = useQueryClient();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [appVersion, setAppVersion] = useState('1.0.0');

  const clearAllUserData = useCallback(async () => {
    // Reset all stores
    resetSubscription();
    resetQuota();

    // Clear React Query cache
    queryClient.clear();

    // Logout from RevenueCat
    await subscriptionService.logout();

    // Clear auth state
    setToken('');
    setUser(undefined);
  }, [resetSubscription, resetQuota, queryClient, setToken, setUser]);

  const logoutMutation = useMutation({
    mutationFn: (authToken: string) => logout(authToken),
    onSuccess: async () => {
      await clearAllUserData();
      router.push('/login');
    },
    onError: async (error) => {
      console.error('Logout error:', error);
      // Clear state even on error
      await clearAllUserData();
      router.push('/login');
    },
  });

  useEffect(() => {
    const stored = storage.getBoolean('notifications_enabled');
    if (stored !== undefined) {
      setNotificationsEnabled(stored);
    }

    const version = Application.nativeApplicationVersion || '1.0.0';
    setAppVersion(version);
  }, []);

  const toggleNotifications = useCallback(async (value: boolean) => {
    setNotificationsEnabled(value);
    storage.set('notifications_enabled', value);

    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Notifications désactivées',
          'Activez les notifications dans les paramètres de votre appareil.',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Paramètres', onPress: () => Linking.openSettings() },
          ]
        );
        setNotificationsEnabled(false);
        storage.set('notifications_enabled', false);
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: () => {
            if (token) {
              logoutMutation.mutate(token);
            }
          },
        },
      ]
    );
  }, [token, logoutMutation]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront définitivement supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirmation',
              'Tapez SUPPRIMER pour confirmer la suppression de votre compte.',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Confirmer',
                  style: 'destructive',
                  onPress: async (text: string | undefined) => {
                    if (text === 'SUPPRIMER') {
                      // TODO: Call API to delete account
                      await clearAllUserData();
                      router.push('/login');
                    } else {
                      Alert.alert('Erreur', 'Le texte de confirmation ne correspond pas.');
                    }
                  },
                },
              ],
              'plain-text'
            );
          },
        },
      ]
    );
  }, [clearAllUserData]);

  const openHelp = useCallback(() => {
    Linking.openURL(PROFILE_EXTERNAL_URLS.help);
  }, []);

  const openAppStore = useCallback(() => {
    const url = Platform.select({
      ios: 'https://apps.apple.com/app/id...',
      android: 'https://play.google.com/store/apps/details?id=...',
    });
    if (url) {
      Linking.openURL(url);
    }
  }, []);

  const openTerms = useCallback(() => {
    Linking.openURL(PROFILE_EXTERNAL_URLS.terms);
  }, []);

  const openPrivacy = useCallback(() => {
    Linking.openURL(PROFILE_EXTERNAL_URLS.privacy);
  }, []);

  const isPremium = user?.role === 3;

  return {
    user,
    isPremium,
    notificationsEnabled,
    appVersion,
    toggleNotifications,
    handleLogout,
    handleDeleteAccount,
    openHelp,
    openAppStore,
    openTerms,
    openPrivacy,
  };
};

export default useProfileSettings;
